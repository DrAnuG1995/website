import { chromium } from "playwright";
import fs from "node:fs";

const OUT = "/tmp/about-audit";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/about", { waitUntil: "networkidle", timeout: 20000 });
await page.waitForTimeout(1500);

// Full page
await page.screenshot({ path: `${OUT}/full.png`, fullPage: true });

// Slice into scroll-position screenshots
const total = await page.evaluate(() => document.body.scrollHeight);
const step = 900;
let i = 0;
for (let y = 0; y < total; y += step) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/scroll-${String(i).padStart(2, "0")}.png`, fullPage: false });
  i++;
}

// Mobile
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mpage = await mobile.newPage();
await mpage.goto("http://localhost:3000/about", { waitUntil: "networkidle", timeout: 20000 });
await mpage.waitForTimeout(1500);
await mpage.screenshot({ path: `${OUT}/mobile-full.png`, fullPage: true });

await browser.close();
console.log("done", total, "px");
