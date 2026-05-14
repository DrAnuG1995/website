import { chromium } from "playwright";
import fs from "node:fs";

const OUT = "/tmp/partners-scroll";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/partners", { waitUntil: "networkidle", timeout: 20000 });
await page.waitForTimeout(2000);

// Scroll progressively to trigger whileInView animations
const total = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < total; y += 600) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(400);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(800);

await page.screenshot({ path: `${OUT}/full.png`, fullPage: true });
console.log("captured");
await browser.close();
