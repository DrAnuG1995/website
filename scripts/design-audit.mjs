import { chromium } from "playwright";
import fs from "node:fs";

const OUT = "/tmp/design-audit";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const routes = [
  ["home", "/"],
  ["for-doctors", "/for-doctors"],
  ["hospitals", "/hospitals"],
  ["partners", "/partners"],
  ["about", "/about"],
];

for (const [name, path] of routes) {
  try {
    await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle", timeout: 20000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${OUT}/${name}-top.png`, fullPage: false });
    await page.screenshot({ path: `${OUT}/${name}-full.png`, fullPage: true });
    console.log(`captured ${name}`);
  } catch (e) {
    console.log(`failed ${name}: ${e.message}`);
  }
}

// Also mobile
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mpage = await mobile.newPage();
await mpage.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 20000 });
await mpage.waitForTimeout(1500);
await mpage.screenshot({ path: `${OUT}/home-mobile.png`, fullPage: true });

await browser.close();
console.log("done →", OUT);
