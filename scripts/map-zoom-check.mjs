import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => { if (m.type() === "error") errors.push(`[console] ${m.text()}`); });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 25000 });
await page.waitForTimeout(3000);
const pinCount = await page.evaluate(() => document.querySelectorAll(".sd-marker").length);
console.log("Markers in DOM:", pinCount);
console.log("Errors:", JSON.stringify(errors, null, 2));
// Zoom into the map to see one pin closely
await page.evaluate(() => {
  const map = (window).__sdMap;
  if (map) {
    map.panTo({ lat: -25, lng: 152 });
    map.setZoom(7);
  }
});
await page.waitForTimeout(1500);
await page.screenshot({ path: "/tmp/map-zoom.png", clip: { x: 0, y: 100, width: 1440, height: 700 } });
await browser.close();
