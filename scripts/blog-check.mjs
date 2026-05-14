import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/blog", { waitUntil: "networkidle", timeout: 20000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: "/tmp/blog-coming.png" });

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mp = await mobile.newPage();
await mp.goto("http://localhost:3000/blog", { waitUntil: "networkidle", timeout: 20000 });
await mp.waitForTimeout(1500);
await mp.screenshot({ path: "/tmp/blog-coming-mobile.png", fullPage: true });

await browser.close();
console.log("done");
