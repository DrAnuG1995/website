#!/usr/bin/env node
/**
 * Audit which hospital splash photos are present in public/hospitals/.
 *
 * Queries Supabase for every active hospital, then for each one prints
 * the expected filename slug and whether a matching file exists in any
 * of the accepted formats (jpg, jpeg, png, webp, avif).
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

// Mirror lib/hospital-photos.ts → hospitalSlug() exactly. Keep these in
// lock-step manually; if you change one, change the other.
function hospitalSlug(name) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
let present = 0;
let missing = 0;

console.log(`\nFound ${rows.length} active hospitals in CRM.\n`);
console.log(
  `Drop photos in: ${PHOTO_DIR.replace(process.cwd(), ".")} (accepted: ${ACCEPTED_EXTS.join(", ")})\n`,
);
console.log("─".repeat(96));
console.log("STATUS  SLUG.EXT".padEnd(60) + "HOSPITAL NAME");
console.log("─".repeat(96));

for (const r of rows) {
  const slug = hospitalSlug(r.name);
  const file = findPhotoFile(slug);
  const status = file ? "  ✓  " : "  ✗  ";
  const filename = file || `${slug}.jpg`;
  if (file) present++;
  else missing++;
  console.log(`${status}   ${filename.padEnd(54)}${r.name}`);
}

console.log("─".repeat(96));
console.log(`\n${present} present · ${missing} missing · ${rows.length} total\n`);

if (missing > 0) {
  console.log(`To add a photo, save it as:`);
  console.log(`  public/hospitals/<slug>.<jpg|png|webp|avif>`);
  console.log(`using the slug shown above. Filename is case-insensitive.\n`);
}
