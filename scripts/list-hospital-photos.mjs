#!/usr/bin/env node
/**
 * Audit which hospital splash photos are present in public/hospitals/.
 *
 * Queries Supabase for every active hospital, derives the city/town
 * from its address, and prints the expected filename slug + a ✓/✗
 * showing whether a matching file exists in any accepted format
 * (jpg, jpeg, png, webp, avif).
 *
 * One photo covers all hospitals in the same city — e.g. the single
 * file `brisbane.jpg` is used by every Brisbane partner.
 *
 * Usage (Node 20+):
 *   node --env-file=.env.local scripts/list-hospital-photos.mjs
 *
 * Env required:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const PHOTO_DIR = join(process.cwd(), "public", "hospitals");
const ACCEPTED_EXTS = ["jpg", "jpeg", "png", "webp", "avif"];

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
    "❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env",
  );
  process.exit(1);
}

// Mirror lib/hospital-photos.ts → citySlug() exactly.
function citySlug(name) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Mirror lib/hospitals.ts → deriveAuTown().
function deriveAuTown(address) {
  if (!address) return null;
  for (const seg of address.split(",").map((s) => s.trim())) {
    const m = seg.match(/^(.+?)\s+(?:VIC|NSW|QLD|WA|SA|TAS|ACT|NT)\s+\d{4}\s*$/);
    if (m) return m[1].trim();
  }
  return null;
}

function findPhotoFile(slug) {
  if (!existsSync(PHOTO_DIR)) return null;
  for (const file of readdirSync(PHOTO_DIR)) {
    const dot = file.lastIndexOf(".");
    if (dot < 0) continue;
    const base = file.slice(0, dot).toLowerCase();
    const ext = file.slice(dot + 1).toLowerCase();
    if (base === slug && ACCEPTED_EXTS.includes(ext)) return file;
  }
  return null;
}

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

const { data, error } = await sb
  .from("hospitals")
  .select("name, status, formatted_address")
  .eq("status", "active")
  .not("name", "ilike", "%trial%")
  .not("name", "ilike", "%test%")
  .not("name", "ilike", "%statdoctor%")
  .order("name");

if (error) {
  console.error("❌ Supabase query failed:", error.message);
  process.exit(1);
}

const rows = data || [];

// Group by city slug so the audit reads "one row per city, with all
// hospitals using that city's photo listed under it".
const byCity = new Map();
for (const r of rows) {
  const town = deriveAuTown(r.formatted_address);
  const slug = town ? citySlug(town) : citySlug(r.name);
  if (!byCity.has(slug))
    byCity.set(slug, { town: town || `(no town derived from ${r.name})`, hospitals: [] });
  byCity.get(slug).hospitals.push(r.name);
}

// Build the available photo map (slug → filename) so we can run the
// same multi-strategy match the website uses.
const availablePhotos = new Map();
if (existsSync(PHOTO_DIR)) {
  for (const file of readdirSync(PHOTO_DIR)) {
    const dot = file.lastIndexOf(".");
    if (dot < 0) continue;
    const base = file.slice(0, dot).toLowerCase();
    const ext = file.slice(dot + 1).toLowerCase();
    if (ACCEPTED_EXTS.includes(ext) && !availablePhotos.has(base))
      availablePhotos.set(base, file);
  }
}
const slugsByLength = [...availablePhotos.keys()].sort(
  (a, b) => b.length - a.length,
);
function slugContains(haystack, slug) {
  if (!slug || !haystack) return false;
  if (haystack === slug) return true;
  if (haystack.startsWith(slug + "-")) return true;
  if (haystack.endsWith("-" + slug)) return true;
  return haystack.includes("-" + slug + "-");
}
function resolvePhoto(name, town, address) {
  if (town) {
    const hit = availablePhotos.get(citySlug(town));
    if (hit) return { slug: citySlug(town), file: hit, strategy: "town" };
  }
  const nameSlug = citySlug(name);
  for (const slug of slugsByLength) {
    if (slugContains(nameSlug, slug))
      return { slug, file: availablePhotos.get(slug), strategy: "name" };
  }
  if (address) {
    const addrSlug = citySlug(address);
    for (const slug of slugsByLength) {
      if (slugContains(addrSlug, slug))
        return { slug, file: availablePhotos.get(slug), strategy: "address" };
    }
  }
  return null;
}

console.log(`\nFound ${rows.length} active hospitals.\n`);
console.log(`Photos live in: ${PHOTO_DIR.replace(process.cwd(), ".")}`);
console.log(`Accepted formats: ${ACCEPTED_EXTS.join(", ")}\n`);
console.log("─".repeat(110));
console.log(
  "RESULT  PHOTO".padEnd(28) +
    "VIA".padEnd(10) +
    "HOSPITAL".padEnd(50) +
    "ADDRESS",
);
console.log("─".repeat(110));

let matched = 0;
let unmatched = 0;
const unmatchedRows = [];

for (const r of rows.sort((a, b) => a.name.localeCompare(b.name))) {
  const town = deriveAuTown(r.formatted_address);
  const hit = resolvePhoto(r.name, town, r.formatted_address);
  if (hit) {
    matched++;
    const photo = hit.file;
    console.log(
      `  ✓     ${photo.padEnd(22)}${hit.strategy.padEnd(10)}${r.name.padEnd(50)}${(r.formatted_address || "").slice(0, 40)}`,
    );
  } else {
    unmatched++;
    unmatchedRows.push(r);
    console.log(
      `  ✗     ${"(no match)".padEnd(22)}${"".padEnd(10)}${r.name.padEnd(50)}${(r.formatted_address || "").slice(0, 40)}`,
    );
  }
}

console.log("─".repeat(110));
console.log(
  `\n${matched} hospitals matched to a photo · ${unmatched} unmatched · ${rows.length} total\n`,
);

if (unmatchedRows.length > 0) {
  console.log("To cover an unmatched hospital, add a city photo whose slug appears");
  console.log("either as a token in the hospital name or in its address. Example:");
  console.log("  public/hospitals/rockhampton.jpg  → covers Mater Private Rockhampton\n");
}
