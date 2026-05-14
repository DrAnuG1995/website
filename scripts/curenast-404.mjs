import { chromium } from "playwright";
import fs from "node:fs";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const url = "https://curenast.framer.website/404";
await page.goto(url, { waitUntil: "networkidle", timeout: 30000 }).catch(() => {});
await page.waitForTimeout(2500);

const out = "/tmp/curenast-404";
fs.mkdirSync(out, { recursive: true });

await page.screenshot({ path: `${out}/full.png`, fullPage: true });
await page.screenshot({ path: `${out}/top.png`, fullPage: false });

const text = await page.evaluate(() => document.body.innerText);
fs.writeFileSync(`${out}/text.txt`, text);

const stylesheet = await page.evaluate(() => {
  const els = document.querySelectorAll("h1, h2, h3, p, a, button, span");
  const out = [];
  for (const el of Array.from(els).slice(0, 40)) {
    const cs = window.getComputedStyle(el);
    out.push({
      tag: el.tagName,
      text: (el.textContent || "").trim().slice(0, 80),
      font: cs.fontFamily.slice(0, 60),
      size: cs.fontSize,
      weight: cs.fontWeight,
      color: cs.color,
      bg: cs.backgroundColor,
    });
  }
  return out;
});
fs.writeFileSync(`${out}/styles.json`, JSON.stringify(stylesheet, null, 2));

console.log("done →", out);
await browser.close();
