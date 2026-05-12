import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

// Folder where ops drops the per-city splash photos. Filename convention:
// <city-slug>.<ext> where slug is citySlug(town) and ext is jpg / png /
// webp / avif. Photos are shared site-wide — the /hospitals carousel
// matches each hospital to a photo by its town, and the /for-doctors
// slideshow references the same files directly. One photo per city, not
// one per hospital, so a single Brisbane photo covers every Brisbane
// partner.
const PHOTO_DIR = "hospitals";
const ACCEPTED_EXTS = ["jpg", "jpeg", "png", "webp", "avif"];

// Normalise a city/town name into a stable URL-safe slug. Lowercase,
// non-alphanumerics collapsed to single hyphens, edges trimmed. Used
// for both filename matching and the audit script — keep in lock-step
// with scripts/list-hospital-photos.mjs if you change either.
export function citySlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Build a Map<slug, publicUrl> by scanning public/hospitals/ once.
// Server-only — must never be called from a client component. Cached
// on the module so repeat calls within a single SSR pass don't restat
// the directory; Next clears the module between revalidations anyway.
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
    // whichever the filesystem returns first.
    if (!map.has(base)) map.set(base, `/${PHOTO_DIR}/${file}`);
  }
  cached = map;
  return map;
}

// Resolve the best splash image for a hospital. Order of preference:
//   1. /public/hospitals/<town-slug>.<ext> — city photo for the suburb
//      we derived from the formatted_address (most hospitals in the same
//      city share this).
//   2. /public/hospitals/<hospital-name-slug>.<ext> — fall back to a
//      photo named after the hospital itself, in case ops curates a
//      specific shot for one hospital.
//   3. logo_url from the CRM (synced from admin portal hospitalImage).
//   4. null — caller decides on a placeholder.
export function pickHospitalPhoto(
  name: string,
  town: string | null,
  logoUrl: string | null,
  photoMap: Map<string, string>,
): string | null {
  if (town) {
    const townHit = photoMap.get(citySlug(town));
    if (townHit) return townHit;
  }
  const nameHit = photoMap.get(citySlug(name));
  if (nameHit) return nameHit;
  if (logoUrl) return logoUrl;
  return null;
}
