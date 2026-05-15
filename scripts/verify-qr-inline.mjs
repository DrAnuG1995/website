import { chromium } from "playwright";

const URL = process.env.URL || "http://localhost:3000";
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await context.newPage();

const thirdPartyHits = [];
page.on("request", (req) => {
  const u = req.url();
  if (u.includes("qrserver.com") || u.includes("qr-code")) {
    thirdPartyHits.push(u);
  }
});

await page.goto(URL, { waitUntil: "networkidle" });

const t0 = Date.now();
await page.getByRole("button", { name: /Doctor app/i }).click();
await page.waitForSelector('svg[aria-label="QR code to download StatDoctor"]', {
  state: "visible",
  timeout: 5000,
});
const dt = Date.now() - t0;

const svgInfo = await page.$eval(
  'svg[aria-label="QR code to download StatDoctor"]',
  (el) => ({
    viewBox: el.getAttribute("viewBox"),
    pathFill: el.querySelector("path")?.getAttribute("fill"),
    pathLen: el.querySelector("path")?.getAttribute("d")?.length,
    boxWidth: el.getBoundingClientRect().width,
    boxHeight: el.getBoundingClientRect().height,
  })
);

console.log(`QR render time (click → visible): ${dt}ms`);
console.log(`viewBox=${svgInfo.viewBox} fill=${svgInfo.pathFill} d.len=${svgInfo.pathLen} box=${svgInfo.boxWidth}x${svgInfo.boxHeight}`);
console.log(`Third-party qrserver requests: ${thirdPartyHits.length}`);
if (thirdPartyHits.length) console.log(thirdPartyHits.join("\n"));

await browser.close();
const ok =
  thirdPartyHits.length === 0 &&
  svgInfo.viewBox === "0 0 648 648" &&
  svgInfo.pathFill === "#1A1A2E" &&
  svgInfo.pathLen > 9000 &&
  svgInfo.boxWidth > 0;

console.log(ok ? "PASS" : "FAIL");
process.exit(ok ? 0 : 1);
