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

// Resolve the best splash image for a hospital. Strategy:
//   1. exact match: town slug from formatted_address → photo file
//   2. substring match: scan the hospital name for any photo's city
//      slug (e.g. "Mater Private Hospital - Brisbane" matches
//      brisbane.jpg). Critical because most CRM addresses don't follow
//      the "Town STATE postcode" pattern cleanly, so address-derived
//      town fails for the majority of rows.
//   3. substring match: same scan against formatted_address
//   4. logo_url from the CRM
//   5. null (caller renders a placeholder)
//
// Substring matches walk the photo map in longest-slug-first order so
// "hervey-bay" wins over "bay" if both exist.
export function pickHospitalPhoto(
  name: string,
  town: string | null,
  address: string | null,
  logoUrl: string | null,
  photoMap: Map<string, string>,
): string | null {
  // 1. Exact town slug match
  if (town) {
    const townHit = photoMap.get(citySlug(town));
    if (townHit) return townHit;
  }

  // Build a longest-first list of photo slugs so substring search picks
  // the most specific match.
  const slugsByLength = [...photoMap.keys()].sort(
    (a, b) => b.length - a.length,
  );

  // 2. Substring match against the hospital name (slug-form)
  const nameSlug = citySlug(name);
  for (const slug of slugsByLength) {
    if (slugContains(nameSlug, slug)) return photoMap.get(slug)!;
  }

  // 3. Substring match against the full address (slug-form)
  if (address) {
    const addrSlug = citySlug(address);
    for (const slug of slugsByLength) {
      if (slugContains(addrSlug, slug)) return photoMap.get(slug)!;
    }
  }

  // 4. CRM logo
  if (logoUrl) return logoUrl;
  return null;
}

// Whether `slug` appears as a hyphen-bounded token sequence inside
// `haystack`. Prevents "tom-price" from matching "tom-pricewich" or
// "atom-price" — both haystack and slug are already in citySlug form
// (lowercase, hyphenated, no other punctuation), so we just need to
// check the boundaries.
function slugContains(haystack: string, slug: string): boolean {
  if (!slug || !haystack) return false;
  if (haystack === slug) return true;
  if (haystack.startsWith(slug + "-")) return true;
  if (haystack.endsWith("-" + slug)) return true;
  return haystack.includes("-" + slug + "-");
}
