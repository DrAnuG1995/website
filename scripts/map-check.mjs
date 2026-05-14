import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 25000 });
await page.waitForTimeout(3500);
await page.screenshot({ path: "/tmp/map-check.png", clip: { x: 0, y: 0, width: 1440, height: 900 } });
console.log("done");
await browser.close();
