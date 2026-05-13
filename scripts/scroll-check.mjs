import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = "./scripts/screens";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

await page.goto("http://localhost:3001/?nolenis=1", { waitUntil: "networkidle" });
await page.waitForTimeout(3000); // let cold-open phase transition run

// We'll step through by scroll position and snap.
const height = await page.evaluate(() => document.documentElement.scrollHeight);
const vh = 900;
const steps = Math.ceil(height / vh);
console.log(`page height: ${height}px · ${steps} viewports`);

for (let i = 0; i < steps; i++) {
  const y = i * vh;
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
  await page.waitForTimeout(900); // let animations settle
  const name = String(i).padStart(2, "0");
  await page.screenshot({ path: `${OUT}/vp-${name}.png`, fullPage: false });
  console.log(`  shot vp-${name}.png at y=${y}`);
}

// Also take a full-page shot for the eagle view
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/full.png`, fullPage: true });
console.log("shot full.png");

await browser.close();
console.log("done");
