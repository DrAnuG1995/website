import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

// Folder where ops drops the per-hospital splash photos. Filename
// convention: <slug>.<ext> where slug is hospitalSlug(name) and ext is
// jpg / png / webp. The server scans this folder at request time and
// matches each hospital row to whatever photo file matches its slug.
const PHOTO_DIR = "hospitals";
const ACCEPTED_EXTS = ["jpg", "jpeg", "png", "webp", "avif"];

// Normalise a hospital name into a stable URL-safe slug. Used for both
// filename matching (lib/hospital-photos.ts) and the audit script
// (scripts/list-hospital-photos.mjs) so the two never drift.
export function hospitalSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD") // strip diacritics
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Build a Map<slug, publicUrl> by scanning public/hospitals/ once.
// Server-only — must never be called from a client component. Cached on
// the module so repeat calls within a single SSR pass don't restat the
// directory; Next clears the module between revalidations anyway.
let cached: Map<string, string> | null = null;
export function loadHospitalPhotoMap(): Map<string, string> {
  if (cached) return cached;
  const dir = join(process.cwd(), "public", PHOTO_DIR);
  const map = new Map<string, string>();
  if (!existsSync(dir)) {
    cached = map;
    return map;
  }
  for (const file of readdirSync(dir)) {
    const dot = file.lastIndexOf(".");
    if (dot < 0) continue;
    const base = file.slice(0, dot).toLowerCase();
    const ext = file.slice(dot + 1).toLowerCase();
    if (!ACCEPTED_EXTS.includes(ext)) continue;
    // First match wins. If the same slug exists in two formats, pick
    // the first one the filesystem returns — predictable enough for an
    // ops-managed folder.
    if (!map.has(base)) map.set(base, `/${PHOTO_DIR}/${file}`);
  }
  cached = map;
  return map;
}

// Resolve the best image URL for a hospital row. Order of preference:
//   1. a file in public/hospitals/ whose name matches the slug
//   2. logo_url from the CRM (synced from admin portal hospitalImage)
//   3. null — caller decides on a placeholder
export function pickHospitalPhoto(
  name: string,
  logoUrl: string | null,
  photoMap: Map<string, string>,
): string | null {
  const slug = hospitalSlug(name);
  const fromFolder = photoMap.get(slug);
  if (fromFolder) return fromFolder;
  if (logoUrl) return logoUrl;
  return null;
}
