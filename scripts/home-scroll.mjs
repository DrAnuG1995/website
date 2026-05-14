import { chromium } from "playwright";
import fs from "node:fs";

const OUT = "/tmp/home-scroll";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 20000 });
await page.waitForTimeout(2500);

const sections = await page.evaluate(() => {
  return Array.from(document.querySelectorAll("section")).map((el) => {
    const rect = el.getBoundingClientRect();
    return {
      tag: el.tagName,
      classes: el.className.slice(0, 100),
      top: Math.round(rect.top + window.scrollY),
      height: Math.round(rect.height),
      text: (el.querySelector("h1, h2")?.textContent ?? "").slice(0, 80),
    };
  });
});
console.log(JSON.stringify(sections, null, 2));

// Screenshot 700-1700 (right after the map area)
await page.evaluate(() => window.scrollTo(0, 720));
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/below-map.png` });

await browser.close();
