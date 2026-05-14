import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/about", { waitUntil: "networkidle", timeout: 20000 });
await page.waitForTimeout(1500);

// Scroll progressively so whileInView animations all fire
const h = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h; y += 500) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(250);
}
await page.waitForTimeout(800);

// Now scroll to the pull quote area (~3200)
await page.evaluate(() => {
  const blocks = document.querySelectorAll("section");
  if (blocks.length >= 4) blocks[3].scrollIntoView({ behavior: "instant", block: "start" });
});
await page.waitForTimeout(1500);
await page.screenshot({ path: "/tmp/about-pullquote.png" });

// Scroll to the closing
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 900));
await page.waitForTimeout(1500);
await page.screenshot({ path: "/tmp/about-closing.png" });

await browser.close();
console.log("done");
