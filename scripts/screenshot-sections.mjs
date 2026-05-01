import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";

const URL = process.env.SCREEN_URL ?? "http://localhost:3000/";
const OUT_DIR = path.resolve("scripts/screens");
mkdirSync(OUT_DIR, { recursive: true });

const SIZES = [
  { name: "mobile",  w: 375,  h: 812 },
  { name: "tablet",  w: 768,  h: 1024 },
];

const browser = await chromium.launch();
for (const s of SIZES) {
  const ctx = await browser.newContext({
    viewport: { width: s.w, height: s.h },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2500);

  // Get total page height
  const totalH = await page.evaluate(() => document.body.scrollHeight);

  // Capture every viewport-height step
  let y = 0;
  let i = 0;
  while (y < totalH) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(700);
    await page.screenshot({
      path: path.join(OUT_DIR, `${s.name}-${String(i).padStart(2, "0")}.png`),
      fullPage: false,
    });
    y += s.h;
    i++;
  }
  console.log(`✓ ${s.name} ${i} screenshots`);
  await ctx.close();
}
await browser.close();
console.log("Done");
