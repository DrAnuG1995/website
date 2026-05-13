import { chromium } from "playwright";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

await page.goto("http://localhost:3001/?nolenis=1", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

// Target each beat at its ideal scroll position
for (const [name, y] of [
  ["beatA", 1900],
  ["beatA_mid", 2250],
  ["beatB", 2750],
  ["beatB_slice", 2950],
  ["beatC", 3250],
  ["beatC_end", 3500],
  ["post_reckoning", 3700],
]) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `./scripts/screens/${name}.png`, fullPage: false });
  console.log(`${name} at y=${y}`);
}
await browser.close();
