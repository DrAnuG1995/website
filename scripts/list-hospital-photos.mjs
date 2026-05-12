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

const sorted = [...byCity.entries()].sort(([a], [b]) => a.localeCompare(b));
let present = 0;
let missing = 0;

console.log(`\nFound ${rows.length} active hospitals across ${sorted.length} cities.\n`);
console.log(`Photos live in: ${PHOTO_DIR.replace(process.cwd(), ".")}`);
console.log(`Accepted formats: ${ACCEPTED_EXTS.join(", ")}\n`);
console.log("─".repeat(96));
console.log("STATUS  CITY SLUG".padEnd(35) + "TOWN".padEnd(25) + "HOSPITALS USING THIS PHOTO");
console.log("─".repeat(96));

for (const [slug, { town, hospitals }] of sorted) {
  const file = findPhotoFile(slug);
  const status = file ? "  ✓  " : "  ✗  ";
  const filename = file || `${slug}.jpg`;
  if (file) present++;
  else missing++;
  const firstLine = `${status}   ${filename.padEnd(29)}${town.padEnd(25)}${hospitals[0]}`;
  console.log(firstLine);
  for (const h of hospitals.slice(1)) {
    console.log(`${" ".repeat(8)}${" ".repeat(29)}${" ".repeat(25)}${h}`);
  }
}

console.log("─".repeat(96));
console.log(`\n${present} cities covered · ${missing} cities missing photos · ${sorted.length} total\n`);

if (missing > 0) {
  console.log(`To add a city photo, save as:`);
  console.log(`  public/hospitals/<city-slug>.<jpg|png|webp|avif>`);
  console.log(`Filename is case-insensitive but please stick to lowercase for`);
  console.log(`Linux/Vercel compatibility.\n`);
}
