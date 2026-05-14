// Render every logo from the LOGOS array in an indexed grid so we can
// match index → which-brand-it-is by eye.
import { chromium } from "playwright";

const LOGOS = [
  "https://cdn.prod.website-files.com/688db6d677516719c3925d01/69891c5f64ac3ee08b11eea1_1.png",
  "https://cdn.prod.website-files.com/688db6d677516719c3925d01/69a79f6b34e627a6c618835f_16.png",
  "https://cdn.prod.website-files.com/688db6d677516719c3925d01/6891b90e4261c120b064cabc_Group%201799.svg",
  "https://cdn.prod.website-files.com/688db6d677516719c3925d01/6891b2ca97d3296f92eecdb3_Group%201797.svg",
  "https://cdn.prod.website-files.com/688db6d677516719c3925d01/6891b9bdc8ce83d0d774d6a0_Group%201795.svg",
  "https://cdn.prod.website-files.com/688db6d677516719c3925d01/6989187d91bc7a590978853b_Hospital%20Logos%20(100%20x%20100%20px).png",
  "https://cdn.prod.website-files.com/688db6d677516719c3925d01/69891c60a412a0902b515580_3.png",
  "https://cdn.prod.website-files.com/688db6d677516719c3925d01/69891c6022354c21182e964e_5.png",
  "https://cdn.prod.website-files.com/688db6d677516719c3925d01/697c24083cb29d7af761cd8f_brhs.png",
  "https://cdn.prod.website-files.com/688db6d677516719c3925d01/697c31849389b03bf00674df_Myfast%20medical%20Logo.png",
  "https://cdn.prod.website-files.com/688db6d677516719c3925d01/69a79f6bd66a38e7ecd9a248_17.png",
  "https://cdn.prod.website-files.com/688db6d677516719c3925d01/69a79f6b8e767399e5f8ad70_4.png",
];

const html = `<!doctype html><html><head><style>
body { background:white; font-family: -apple-system, system-ui, sans-serif; padding:20px; }
.grid { display:grid; grid-template-columns: repeat(4, 220px); gap:24px; }
.cell { border:1px solid #ddd; padding:12px; border-radius:8px; text-align:center; }
.idx  { font-size:12px; color:#666; margin-bottom:8px; font-weight:600; }
.box  { height:100px; display:flex; align-items:center; justify-content:center; background:#f6f6f6; border-radius:4px; }
img   { max-height:80px; max-width:180px; height:auto; width:auto; }
</style></head><body><div class="grid">
${LOGOS.map((src, i) => `<div class="cell"><div class="idx">[${i}]</div><div class="box"><img src="${src}" crossorigin="anonymous" /></div></div>`).join("")}
</div></body></html>`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1000, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/playwright-out/logos-index.png", fullPage: true });
console.log("scripts/playwright-out/logos-index.png");
await browser.close();
