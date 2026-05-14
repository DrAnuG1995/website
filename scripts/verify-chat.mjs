import { chromium } from "playwright";
const browser = await chromium.launch();
const cases = [
  { name: "mobile-top",      vp: { width: 375, height: 812 }, scroll: 0 },
  { name: "mobile-scrolled", vp: { width: 375, height: 812 }, scroll: 800 },
  { name: "laptop",          vp: { width: 1280, height: 800 }, scroll: 500 },
];
for (const c of cases) {
  const ctx = await browser.newContext({ viewport: c.vp });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded", timeout: 25000 });
  await page.waitForTimeout(1000);
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), c.scroll);
  await page.waitForTimeout(900);
  const bubble = await page.locator('button[aria-label="Open StatDoctor chat"]').count();
  await page.screenshot({ path: `/tmp/chat-${c.name}.png`, fullPage: false });
  console.log(`${c.name.padEnd(18)} bubble=${bubble} (${c.vp.width}×${c.vp.height} scrollY=${c.scroll})`);
  await ctx.close();
}
await browser.close();
