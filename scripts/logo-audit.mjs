// Measure each partner logo's natural + rendered size in the home strip,
// then suggest a per-logo height so visible size reads consistent.
// Run: node scripts/logo-audit.mjs
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const URL = process.env.URL ?? "http://localhost:3000";
const OUT = "scripts/playwright-out";
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "domcontentloaded" });
await page.waitForSelector(".marquee-mask", { state: "attached" });
await page.waitForFunction(() => document.querySelectorAll(".marquee-mask img").length >= 12);
// Pause the marquee so bounding rects are stable
await page.addStyleTag({ content: ".marquee-mask * { animation: none !important; }" });
await page.waitForTimeout(500);

// Wait for all logo images to load
await page.evaluate(async () => {
  const imgs = Array.from(document.querySelectorAll(".marquee-mask img"));
  await Promise.all(imgs.map((i) => i.complete ? Promise.resolve() : new Promise((r) => { i.onload = r; i.onerror = r; })));
});

const data = await page.evaluate(() => {
  const imgs = Array.from(document.querySelectorAll(".marquee-mask img"));
  // first half = the unique 12 logos
  const half = imgs.slice(0, imgs.length / 2);
  return half.map((img) => {
    const r = img.getBoundingClientRect();
    return {
      src: img.src.split("/").pop(),
      naturalW: img.naturalWidth,
      naturalH: img.naturalHeight,
      renderedW: Math.round(r.width),
      renderedH: Math.round(r.height),
      aspect: +(img.naturalWidth / img.naturalHeight).toFixed(2),
    };
  });
});

const fmt = (rows) => {
  const heads = ["#", "src", "natW", "natH", "rendW", "rendH", "aspect"];
  const widths = heads.map((h, i) => Math.max(h.length, ...rows.map((r) => String(Object.values(r)[i]).length)));
  const line = (vals) => vals.map((v, i) => String(v).padEnd(widths[i])).join("  ");
  return [line(heads), line(widths.map((w) => "-".repeat(w))), ...rows.map((r, i) => line([i, r.src.slice(0, 38), r.naturalW, r.naturalH, r.renderedW, r.renderedH, r.aspect]))].join("\n");
};

const indexed = data.map((d, i) => ({ ...d, idx: i }));
console.log("Logo strip — measured rendering");
console.log(fmt(indexed));

await page.locator(".marquee-mask").screenshot({ path: `${OUT}/logos-after.png`, animations: "disabled" });
console.log(`\nScreenshot: ${OUT}/logos-after.png`);

await writeFile(`${OUT}/logos-measurements.json`, JSON.stringify(indexed, null, 2));

await browser.close();
