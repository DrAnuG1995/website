import { chromium } from "playwright";
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 1400 } });
const page = await context.newPage();
await page.goto("http://localhost:3000/about", { waitUntil: "networkidle" });
await page.evaluate(() => {
  const h = [...document.querySelectorAll("h2")].find((el) =>
    /team of three/i.test(el.textContent || "")
  );
  h?.scrollIntoView({ block: "start" });
});
await page.waitForTimeout(600);
await page.screenshot({
  path: "scripts/screens/team-both.png",
  clip: { x: 0, y: 0, width: 1280, height: 1400 },
});
await browser.close();
