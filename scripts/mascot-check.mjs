import { chromium } from "playwright";

const browser = await chromium.launch();
// Test at multiple viewport widths to catch the cutoff
for (const vw of [1280, 1440, 1600]) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3001/", { waitUntil: "networkidle" });
  await page.waitForTimeout(3500);
  // Scroll to founder section
  await page.evaluate(() => {
    const el = document.querySelector("#founder");
    if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `./scripts/screens/founder-${vw}.png`, fullPage: false });
  console.log(`saved founder-${vw}.png`);
  await ctx.close();
}
await browser.close();
