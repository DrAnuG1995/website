/**
 * Full-page screenshot dump for visual review.
 *
 * Walks every post and the /blog index in a headed Chromium and writes
 * full-page PNGs into ./.screenshots/ so you can flip through them in
 * Finder instead of scrolling the dev server 33 times.
 *
 * Run with:  npx tsx tests/e2e/blog-screenshots.ts
 */

import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const POSTS_DIR = path.resolve(__dirname, "..", "..", "content", "posts");
const OUT_DIR = path.resolve(__dirname, "..", "..", ".screenshots");

const HEADED = process.argv.includes("--headed");

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const slugs = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => (JSON.parse(fs.readFileSync(path.join(POSTS_DIR, f), "utf-8")) as { slug: string }).slug);

  console.log(`[screenshots] Capturing /blog + ${slugs.length} post pages → ${OUT_DIR}`);

  const browser = await chromium.launch({ headless: !HEADED });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Index first
  await page.goto(`${BASE}/blog`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT_DIR, "00-index.png"), fullPage: true });
  console.log("  ✓ /blog");

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const url = `${BASE}/blog/${slug}`;
    const resp = await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    // Scroll the page so lazy images load before we capture
    await page.evaluate(async () => {
      const step = 400;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(400);
    const fname = `${String(i + 1).padStart(2, "0")}-${slug}.png`;
    await page.screenshot({ path: path.join(OUT_DIR, fname), fullPage: true });
    console.log(`  ✓ [${i + 1}/${slugs.length}] HTTP ${resp?.status()}  ${slug}`);
  }

  await browser.close();
  console.log(`\nDone. Open ${OUT_DIR}/ to review.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
