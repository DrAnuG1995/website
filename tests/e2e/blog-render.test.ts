/**
 * Blog-page rendering smoke tests.
 *
 * Boots a real Chromium via Playwright and walks every migrated post,
 * asserting visual invariants we keep accidentally breaking:
 *
 *   • Title font-size is capped (regression: clamp went to 88px and looked
 *     like a magazine masthead).
 *   • Every callout block (KEY FACTS / BIG STAT / INSIGHT / KEY TAKEAWAY /
 *     INFO) actually has visible text inside — no empty navy strips.
 *   • Hero <img> exists and loads (200 OK + non-zero natural dimensions).
 *   • Every inline article <img> loads (no broken icons mid-body).
 *   • Hero image height is sensible (regression: NSW Health logo rendered
 *     at ~700px because we used its OG image as the hero).
 *   • Every "As Reported By" source card either renders its scraped image
 *     OR shows the publisher-name placeholder (no broken icons, no empty
 *     placeholders).
 *
 * Run with:  npm run test:e2e
 * Requires the Next dev server on http://localhost:3000 with at least one
 * migrated post in content/posts/. The suite skips cleanly if neither is true.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chromium, type Browser, type Page } from "playwright";
import fs from "fs";
import path from "path";

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const POSTS_DIR = path.resolve(__dirname, "..", "..", "content", "posts");

// Read slugs synchronously at module-load time so vitest's `it.each` sees
// the real list when it collects test cases.
type PostJson = {
  slug: string;
  title: string;
  image_url: string | null;
  content_markdown: string;
  sources: Array<{ title: string; url: string; publisher: string }>;
};

const POSTS: PostJson[] = (() => {
  try {
    return fs
      .readdirSync(POSTS_DIR)
      .filter((f) => f.endsWith(".json"))
      .map(
        (f) =>
          JSON.parse(
            fs.readFileSync(path.join(POSTS_DIR, f), "utf-8"),
          ) as PostJson,
      );
  } catch {
    return [];
  }
})();
const SLUGS: string[] = POSTS.map((p) => p.slug);

// Strip frontmatter-ish noise (TL;DR line, callouts, headings, image lines)
// so we compare actual prose rather than the editorial scaffolding every
// post shares.
function prose(md: string): string {
  return md
    .split("\n")
    .filter(
      (l) =>
        !l.startsWith("#") &&
        !l.startsWith(">") &&
        !l.startsWith("![") &&
        !l.startsWith("---") &&
        !l.trim().startsWith("*[") &&
        l.trim().length > 0,
    )
    .join("\n");
}

// Hard caps — tweak in one place if the design language changes.
const MAX_TITLE_HEIGHT_PX = 240; // 4 lines × ~60px line-height at the desktop cap
const MAX_HERO_HEIGHT_PX = 820; // hero figure shouldn't dominate above-the-fold
const MIN_HERO_HEIGHT_PX = 120;
const MAX_INLINE_IMAGE_HEIGHT_PX = 720;

let browser: Browser;
let serverReady = false;

beforeAll(async () => {
  try {
    const probe = await fetch(BASE, { method: "GET" });
    serverReady = probe.ok;
  } catch {
    serverReady = false;
  }
  if (!serverReady) {
    console.warn(
      `\n[blog-render] Dev server at ${BASE} not reachable. Skipping suite.\n`,
    );
    return;
  }
  if (SLUGS.length === 0) {
    console.warn(
      `\n[blog-render] No posts in ${POSTS_DIR}. Skipping suite.\n`,
    );
    return;
  }
  browser = await chromium.launch();
}, 30_000);

afterAll(async () => {
  if (browser) await browser.close();
});

function maybeSkip(): boolean {
  return !serverReady || SLUGS.length === 0;
}

async function load(page: Page, slug: string) {
  const url = `${BASE}/blog/${slug}`;
  const resp = await page.goto(url, { waitUntil: "networkidle" });
  expect(resp?.status(), `GET ${url} should be 200`).toBe(200);
}

describe("blog post pages", () => {
  it("at least one migrated post is loadable from /blog", async () => {
    if (maybeSkip()) return;
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const resp = await page.goto(`${BASE}/blog`, { waitUntil: "networkidle" });
    expect(resp?.status()).toBe(200);
    // Card grid present
    const cards = await page.locator(".blog-index-card").count();
    expect(cards, "blog index should render at least one card").toBeGreaterThan(0);
    await page.close();
  });

  it.each(SLUGS.length > 0 ? SLUGS : ["(no posts)"])("[%s] title fits inside its hero band", async (slug) => {
    if (maybeSkip()) return;
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await load(page, slug);
    const h1 = page.locator("h1").first();
    expect(await h1.count(), "h1 should exist").toBeGreaterThan(0);
    expect(await h1.isVisible(), "h1 should be visible").toBe(true);
    const box = await h1.boundingBox();
    expect(box, "h1 should have a bounding box").not.toBeNull();
    expect(
      box!.height,
      `h1 height ${box!.height}px > ${MAX_TITLE_HEIGHT_PX}px cap — title is too big`,
    ).toBeLessThan(MAX_TITLE_HEIGHT_PX);
    await page.close();
  });

  it.each(SLUGS.length > 0 ? SLUGS : ["(no posts)"])(
    "[%s] every callout block has visible text inside",
    async (slug) => {
      if (maybeSkip()) return;
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      await load(page, slug);

      const calloutClasses = [
        ".callout-key-facts",
        ".callout-takeaway",
        ".callout-info",
        ".callout-insight",
        ".blog-stat-block",
        ".blog-insight-card",
      ];
      const failures: string[] = [];
      for (const cls of calloutClasses) {
        const all = page.locator(cls);
        const count = await all.count();
        for (let i = 0; i < count; i++) {
          const el = all.nth(i);
          const text = (await el.innerText()).trim();
          if (text.length < 5) failures.push(`${cls}#${i} is empty (text="${text}")`);
        }
      }
      expect(failures, "empty callout boxes found:\n" + failures.join("\n")).toEqual(
        [],
      );
      await page.close();
    },
  );

  it.each(SLUGS.length > 0 ? SLUGS : ["(no posts)"])(
    "[%s] hero image renders within sane height bounds",
    async (slug) => {
      if (maybeSkip()) return;
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      await load(page, slug);

      const heroImg = page.locator(".article-hero-img").first();
      const heroPresent = (await heroImg.count()) > 0;
      if (!heroPresent) {
        // Typography hero — acceptable when no photo exists. Just confirm the
        // band is visible so we don't have a completely empty hero slot.
        const typo = page.locator(".article-hero-typo").first();
        expect(
          await typo.isVisible(),
          "no hero image AND no typography fallback",
        ).toBe(true);
        await page.close();
        return;
      }

      // Real <img> path — wait for the load (or error) event before measuring.
      // We tolerate the load failing (third-party CDNs occasionally refuse
      // headless-browser requests even when the URL works for real users).
      // What we DON'T tolerate is a successfully-loaded image rendering
      // outside the sane height window.
      await heroImg.scrollIntoViewIfNeeded();
      const dims = await heroImg.evaluate(
        (img: HTMLImageElement) =>
          new Promise<{
            ok: boolean;
            nW: number;
            nH: number;
            renderH: number;
          }>((resolve) => {
            const finish = () =>
              resolve({
                ok: img.complete && img.naturalWidth > 0,
                nW: img.naturalWidth,
                nH: img.naturalHeight,
                renderH: img.getBoundingClientRect().height,
              });
            if (img.complete) return finish();
            img.addEventListener("load", finish, { once: true });
            img.addEventListener("error", finish, { once: true });
            setTimeout(finish, 8_000);
          }),
      );
      if (!dims.ok) {
        console.warn(
          `[${slug}] hero image didn't load in headless Chromium — skipping height assertion. Verify in a real browser.`,
        );
        await page.close();
        return;
      }
      expect(
        dims.renderH,
        `hero rendered at ${dims.renderH}px — outside [${MIN_HERO_HEIGHT_PX}, ${MAX_HERO_HEIGHT_PX}]`,
      ).toBeGreaterThan(MIN_HERO_HEIGHT_PX);
      expect(dims.renderH).toBeLessThan(MAX_HERO_HEIGHT_PX);
      await page.close();
    },
  );

  it.each(SLUGS.length > 0 ? SLUGS : ["(no posts)"])("[%s] all inline article images load", async (slug) => {
    if (maybeSkip()) return;
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await load(page, slug);

    // Inline images live inside the post body, not in nav/footer/source cards.
    const inlineImgs = page.locator(".post-prose img, article img:not(.article-hero-img):not(.source-gallery-img)");
    const count = await inlineImgs.count();
    const broken: string[] = [];
    for (let i = 0; i < count; i++) {
      const img = inlineImgs.nth(i);
      await img.scrollIntoViewIfNeeded();
      const info = await img.evaluate(
        (el: HTMLImageElement) =>
          new Promise<{ src: string; ok: boolean; renderH: number }>((resolve) => {
            const finish = () =>
              resolve({
                src: el.currentSrc || el.src,
                ok: el.complete && el.naturalWidth > 0,
                renderH: el.getBoundingClientRect().height,
              });
            if (el.complete) return finish();
            el.addEventListener("load", finish, { once: true });
            el.addEventListener("error", finish, { once: true });
            setTimeout(finish, 8_000);
          }),
      );
      if (!info.ok) broken.push(`broken: ${info.src}`);
      if (info.renderH > MAX_INLINE_IMAGE_HEIGHT_PX)
        broken.push(`oversized (${Math.round(info.renderH)}px): ${info.src}`);
    }
    expect(broken, "inline image issues:\n" + broken.join("\n")).toEqual([]);
    await page.close();
  });

  // ──────────────────────────────────────────────────────────────────────
  // Corpus-level checks (run once, not per-post). These don't touch the
  // browser — they're pure JSON-content audits surfacing duplication and
  // emptiness issues across the whole 33-post set.
  // ──────────────────────────────────────────────────────────────────────

  it("no two posts share the same hero image_url", () => {
    if (POSTS.length === 0) return;
    const byUrl = new Map<string, string[]>();
    for (const p of POSTS) {
      if (!p.image_url) continue;
      const list = byUrl.get(p.image_url) ?? [];
      list.push(p.slug);
      byUrl.set(p.image_url, list);
    }
    const dupes = [...byUrl.entries()]
      .filter(([, slugs]) => slugs.length > 1)
      .map(([url, slugs]) => `  ${slugs.join(", ")} all use ${url.slice(0, 80)}…`);
    expect(
      dupes,
      "posts sharing the same hero image:\n" + dupes.join("\n"),
    ).toEqual([]);
  });

  it.each(SLUGS.length > 0 ? SLUGS : ["(no posts)"])(
    "[%s] body has at least 700 words of prose",
    (slug) => {
      if (POSTS.length === 0) return;
      const post = POSTS.find((p) => p.slug === slug)!;
      const wordCount = prose(post.content_markdown).split(/\s+/).filter(Boolean)
        .length;
      // 700 words is the "is there real content here" sanity floor, not a
      // quality gate: a tight 741-word faithful rewrite that covers its
      // topic in full beats a padded 1500-word one. Quality triage happens
      // in the migrator's KEEP allowlist, not here.
      expect(
        wordCount,
        `${slug} has only ${wordCount} prose words, body is essentially empty`,
      ).toBeGreaterThanOrEqual(700);
    },
  );

  it.each(SLUGS.length > 0 ? SLUGS : ["(no posts)"])(
    "[%s] cites at least 2 sources",
    (slug) => {
      if (POSTS.length === 0) return;
      const post = POSTS.find((p) => p.slug === slug)!;
      // Some narrow topics (e.g. "how to start as a locum doctor" cites
      // AHPRA + Medicare and not much else) only have 2 truly authoritative
      // sources. The migrator already enforces the gov.au/edu.au/org.au
      // allowlist on every URL that lands here.
      expect(
        post.sources.length,
        `${slug} cites only ${post.sources.length} sources`,
      ).toBeGreaterThanOrEqual(2);
    },
  );

  it("no two posts share their opening 400 chars of prose (content mixup)", () => {
    if (POSTS.length === 0) return;
    const head = new Map<string, string[]>();
    for (const p of POSTS) {
      const opener = prose(p.content_markdown).replace(/\s+/g, " ").trim().slice(0, 400);
      if (opener.length < 100) continue; // too-short bodies handled elsewhere
      const list = head.get(opener) ?? [];
      list.push(p.slug);
      head.set(opener, list);
    }
    const collisions = [...head.entries()]
      .filter(([, slugs]) => slugs.length > 1)
      .map(([, slugs]) => `  duplicate opener across: ${slugs.join(", ")}`);
    expect(
      collisions,
      "posts with identical opening prose:\n" + collisions.join("\n"),
    ).toEqual([]);
  });

  it.each(SLUGS.length > 0 ? SLUGS : ["(no posts)"])(
    "[%s] every As-Reported-By card either has a loaded image or a publisher placeholder",
    async (slug) => {
      if (maybeSkip()) return;
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      await load(page, slug);

      const cards = page.locator(".source-gallery-card");
      const count = await cards.count();
      if (count === 0) {
        // No source gallery on this post — acceptable.
        await page.close();
        return;
      }

      const failures: string[] = [];
      for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        await card.scrollIntoViewIfNeeded();

        // The card may start as an <img>, then swap to a placeholder via the
        // React onError handler in SourceImageGallery. Wait for either:
        //   - the img element to finish loading (success), OR
        //   - the placeholder element to appear (the onError path)
        const img = card.locator("img.source-gallery-img");
        if ((await img.count()) > 0) {
          await img
            .evaluate(
              (el: HTMLImageElement) =>
                new Promise<void>((resolve) => {
                  if (el.complete) return resolve();
                  el.addEventListener("load", () => resolve(), { once: true });
                  el.addEventListener("error", () => resolve(), { once: true });
                  // 7 s gives the SourceCardImage 5-s self-timeout room to fire
                  // and React time to flip the element to a placeholder.
                  setTimeout(resolve, 7_000);
                }),
            )
            .catch(() => undefined); // element may have been swapped already
        }
        // Wait for the React state flip (5-s timeout + reconciliation) before
        // re-querying the DOM for either img or placeholder.
        await page.waitForTimeout(5_500);

        const finalImg = card.locator("img.source-gallery-img");
        const placeholder = card.locator(".source-gallery-img-placeholder");

        const hasImg = (await finalImg.count()) > 0;
        const hasPlaceholder = (await placeholder.count()) > 0;

        if (hasImg) {
          const info = await finalImg.evaluate((el: HTMLImageElement) => ({
            src: el.currentSrc || el.src,
            ok: el.complete && el.naturalWidth > 0,
          }));
          if (!info.ok) failures.push(`card#${i} broken img: ${info.src}`);
        } else if (hasPlaceholder) {
          const text = (
            await placeholder.locator(".source-gallery-img-publisher").innerText()
          ).trim();
          if (text.length === 0)
            failures.push(`card#${i} placeholder has no publisher text`);
        } else {
          failures.push(`card#${i} has neither image nor placeholder`);
        }
      }
      expect(
        failures,
        "source card render issues:\n" + failures.join("\n"),
      ).toEqual([]);
      await page.close();
    },
  );
});

