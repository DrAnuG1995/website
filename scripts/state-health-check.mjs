import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 25000 });
const h = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h; y += 700) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(220);
}
// Find the section with "Working with" eyebrow and scroll to it
await page.evaluate(() => {
  const sections = Array.from(document.querySelectorAll("section"));
  const band = sections.find((s) => s.textContent?.includes("Working with") && s.textContent.includes("State health"));
  if (band) band.scrollIntoView({ block: "center", behavior: "instant" });
});
await page.waitForTimeout(1500);
await page.screenshot({ path: "/tmp/state-health.png" });
await browser.close();
console.log("done");
