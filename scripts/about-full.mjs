import { chromium } from "playwright";
const browser = await chromium.launch();
for (const vp of [{ name: "laptop", w: 1280, h: 900 }, { name: "mobile", w: 375, h: 812 }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000/about", { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    const teamH = Array.from(document.querySelectorAll('h2')).find(el => el.textContent?.includes("team of three"));
    if (teamH) {
      const r = teamH.getBoundingClientRect();
      window.scrollBy(0, r.top + 250);
    }
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `/tmp/about-full-${vp.name}.png`, fullPage: false });
  console.log(`✓ ${vp.name}`);
  await ctx.close();
}
await browser.close();
