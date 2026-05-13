import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";

const VIEWPORTS = [
  { name: "mobile",  width: 375,  height: 812 },
  { name: "tablet",  width: 768,  height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

const URL = process.env.SCREEN_URL ?? "http://localhost:3000/";
const OUT_DIR = path.resolve("scripts/screens");
mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
for (const v of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: v.width, height: v.height },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2500);
  await page.screenshot({
    path: path.join(OUT_DIR, `${v.name}-full.png`),
    fullPage: true,
  });
  await page.screenshot({
    path: path.join(OUT_DIR, `${v.name}-fold.png`),
    fullPage: false,
  });
  console.log(`✓ ${v.name} (${v.width}×${v.height})`);
  await ctx.close();
}
await browser.close();
console.log(`Screenshots saved to ${OUT_DIR}`);
