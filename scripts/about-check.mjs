import { chromium } from "playwright";
const browser = await chromium.launch();
const cases = [
  { name: "mobile", vp: { width: 375, height: 812 } },
  { name: "laptop", vp: { width: 1280, height: 900 } },
];
for (const c of cases) {
  const ctx = await browser.newContext({ viewport: c.vp });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000/about", { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(1500);
  const team = page.locator('h2:has-text("team of three")').first();
  await team.scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(900);
  await page.screenshot({ path: `/tmp/about-team-${c.name}.png`, fullPage: false });
  console.log(`✓ ${c.name}`);
  await ctx.close();
}
await browser.close();
