import { chromium } from "playwright";
const browser = await chromium.launch();
const cases = [
  { name: "mobile", vp: { width: 375, height: 200 } },
  { name: "tablet", vp: { width: 768, height: 200 } },
  { name: "laptop", vp: { width: 1280, height: 200 } },
  { name: "wide",   vp: { width: 1920, height: 200 } },
];
for (const c of cases) {
  const ctx = await browser.newContext({ viewport: c.vp });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded", timeout: 25000 });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `/tmp/nav-${c.name}.png`, fullPage: false });
  console.log(`✓ ${c.name} (${c.vp.width})`);
  await ctx.close();
}
await browser.close();
