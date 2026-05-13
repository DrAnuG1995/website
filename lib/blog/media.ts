import "server-only";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import type { Source } from "./posts";

export type InlineImage = { src: string; caption: string };

export type SourceWithImage = Source & {
  imageUrl: string | null;
  inlineImages: InlineImage[];
};

/**
 * Disk cache for scraped OG metadata. Keyed by URL hash. Survives across
 * dev reloads and feeds into the production build, so each source URL is
 * only fetched once.
 */
const CACHE_DIR = path.join(process.cwd(), ".next", "cache", "blog-og");

type CachedOg = {
  imageUrl: string | null;
  inlineImages: InlineImage[];
  fetchedAt: string;
};

function cachePath(url: string): string {
  const hash = crypto.createHash("sha1").update(url).digest("hex");
  return path.join(CACHE_DIR, `${hash}.json`);
}

function readCache(url: string): CachedOg | null {
  try {
    const raw = fs.readFileSync(cachePath(url), "utf-8");
    return JSON.parse(raw) as CachedOg;
  } catch {
    return null;
  }
}

function writeCache(url: string, data: CachedOg): void {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(cachePath(url), JSON.stringify(data));
  } catch {
    // Cache write failures are non-fatal — we just re-fetch next build.
  }
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function absolutize(src: string, baseUrl: string): string | null {
  try {
    return new URL(src, baseUrl).toString();
  } catch {
    return null;
  }
}

/**
 * Pull the og:image (and a couple of inline content images) out of a
 * publisher article's HTML. Stays read-only — we never persist the
 * underlying image, just remember its URL for hot-linking.
 */
function findFirstMatch(html: string, patterns: RegExp[]): string | null {
  for (const re of patterns) {
    const m = html.match(re);
    if (m && m[1]) return m[1];
  }
  return null;
}

function parseOg(
  html: string,
  baseUrl: string,
): { imageUrl: string | null; inlineImages: InlineImage[] } {
  // Try the common image-meta patterns in priority order. Different publishers
  // use different ones — government sites often skip og:image but expose
  // schema.org JSON-LD or a `link rel="image_src"`.
  const heroCandidates: (string | null)[] = [
    findFirstMatch(html, [
      /<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image:secure_url["']/i,
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    ]),
    findFirstMatch(html, [
      /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i,
    ]),
    findFirstMatch(html, [
      /<meta[^>]+itemprop=["']image["'][^>]+content=["']([^"']+)["']/i,
      /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i,
    ]),
    // JSON-LD schema.org Article — image can be a string, array, or object
    (() => {
      const jsonLdRe =
        /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
      let m: RegExpExecArray | null;
      while ((m = jsonLdRe.exec(html)) !== null) {
        try {
          const data = JSON.parse(m[1].trim());
          const items = Array.isArray(data) ? data : [data];
          for (const item of items) {
            const img = item?.image;
            if (typeof img === "string") return img;
            if (Array.isArray(img) && typeof img[0] === "string") return img[0];
            if (img?.url) return img.url;
          }
        } catch {
          // Malformed JSON-LD — skip and try the next script tag.
        }
      }
      return null;
    })(),
  ];

  const imageUrl =
    heroCandidates
      .filter((c): c is string => Boolean(c))
      .map((c) => absolutize(decodeEntities(c), baseUrl))
      .find((u): u is string => Boolean(u)) ?? null;

  const inlineImages: InlineImage[] = [];
  // Pull a couple of in-article figure images. Skip avatars/icons/sprites.
  const imgRe = /<img[^>]+src=["']([^"']+)["'][^>]*?(?:alt=["']([^"']*)["'])?/gi;
  let m: RegExpExecArray | null;
  while ((m = imgRe.exec(html)) !== null && inlineImages.length < 4) {
    const rawSrc = m[1];
    if (!rawSrc) continue;
    if (
      /sprite|icon|logo|avatar|favicon|gravatar|pixel|tracking|share|emoji/i.test(
        rawSrc,
      )
    )
      continue;
    if (/\.(svg|gif)(\?|$)/i.test(rawSrc)) continue;
    const abs = absolutize(decodeEntities(rawSrc), baseUrl);
    if (!abs) continue;
    if (imageUrl && abs === imageUrl) continue;
    if (inlineImages.find((x) => x.src === abs)) continue;
    inlineImages.push({ src: abs, caption: decodeEntities(m[2] ?? "") });
  }

  return { imageUrl, inlineImages };
}

async function scrapeOg(url: string): Promise<CachedOg> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; StatDoctorBot/1.0; +https://statdoctor.app)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    if (!res.ok) {
      return { imageUrl: null, inlineImages: [], fetchedAt: new Date().toISOString() };
    }
    const html = await res.text();
    const parsed = parseOg(html, url);
    return { ...parsed, fetchedAt: new Date().toISOString() };
  } catch {
    return { imageUrl: null, inlineImages: [], fetchedAt: new Date().toISOString() };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Guardian-specific path: hit the Content API for richer, more reliable
 * image data than scraping the public page. Falls back to OG scrape if the
 * API call fails or the key is missing.
 *
 * Docs: https://open-platform.theguardian.com/documentation/item
 *   GET https://content.guardianapis.com/{path}?show-fields=thumbnail,main,body
 */
async function fetchGuardian(url: string): Promise<CachedOg | null> {
  const apiKey = process.env.GUARDIAN_API_KEY;
  if (!apiKey) return null;

  let articlePath: string;
  try {
    const u = new URL(url);
    articlePath = u.pathname.replace(/^\/+/, "");
  } catch {
    return null;
  }

  const apiUrl = `https://content.guardianapis.com/${articlePath}?show-fields=thumbnail,main,body&api-key=${encodeURIComponent(apiKey)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(apiUrl, { signal: controller.signal });
    if (!res.ok) return null;

    const json = (await res.json()) as {
      response?: {
        content?: {
          fields?: { thumbnail?: string; main?: string; body?: string };
        };
      };
    };
    const fields = json?.response?.content?.fields;
    if (!fields) return null;

    // Upscale Guardian thumbnail to a hero-friendly width. media.guim.co.uk
    // only serves unsigned URLs at fixed widths — 140 / 500 / 1000. Anything
    // else returns 403, so we explicitly target /1000.jpg (the largest
    // available without a signed URL).
    const upsizedThumb = fields.thumbnail
      ? fields.thumbnail.replace(/\/(\d{2,4})\.(jpg|jpeg|png)(?:\?|$)/i, "/1000.$2")
      : null;
    const imageUrl = upsizedThumb ? absolutize(upsizedThumb, url) : null;

    // Pull additional images from the article body — these are richer than
    // OG scraping (charts, on-the-ground photos rather than hero re-use).
    const inlineImages: InlineImage[] = [];
    const html = `${fields.main ?? ""}\n${fields.body ?? ""}`;
    const imgRe = /<img[^>]+src=["']([^"']+)["'][^>]*?(?:alt=["']([^"']*)["'])?/gi;
    let m: RegExpExecArray | null;
    while ((m = imgRe.exec(html)) !== null && inlineImages.length < 4) {
      const abs = absolutize(decodeEntities(m[1]), url);
      if (!abs) continue;
      if (imageUrl && abs === imageUrl) continue;
      if (inlineImages.find((x) => x.src === abs)) continue;
      inlineImages.push({ src: abs, caption: decodeEntities(m[2] ?? "") });
    }

    return {
      imageUrl,
      inlineImages,
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function isGuardianUrl(url: string): boolean {
  try {
    return new URL(url).hostname.endsWith("theguardian.com");
  } catch {
    return false;
  }
}

export async function hydrateSourceImages(
  sources: Source[],
): Promise<SourceWithImage[]> {
  const results = await Promise.all(
    sources.map(async (s) => {
      const cached = readCache(s.url);
      if (cached) {
        return {
          ...s,
          imageUrl: cached.imageUrl,
          inlineImages: cached.inlineImages,
        };
      }

      // Prefer Guardian Content API for theguardian.com URLs — richer than
      // scraping the public page (chart images, body photos, not just OG hero).
      const fresh = isGuardianUrl(s.url)
        ? ((await fetchGuardian(s.url)) ?? (await scrapeOg(s.url)))
        : await scrapeOg(s.url);

      writeCache(s.url, fresh);
      return {
        ...s,
        imageUrl: fresh.imageUrl,
        inlineImages: fresh.inlineImages,
      };
    }),
  );
  return results;
}
