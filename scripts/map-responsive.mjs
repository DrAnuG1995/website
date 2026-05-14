import { chromium } from "playwright";

const VIEWPORTS = [
  { name: "mobile-portrait",   width: 375,  height: 812 },  // iPhone 12/13/14
  { name: "mobile-large",      width: 414,  height: 896 },  // iPhone 11 Pro Max
  { name: "mobile-landscape",  width: 812,  height: 375 },  // landscape phone
  { name: "tablet-portrait",   width: 768,  height: 1024 }, // iPad portrait
  { name: "tablet-landscape",  width: 1024, height: 768 },  // iPad landscape
  { name: "laptop",            width: 1280, height: 800 },
  { name: "desktop",           width: 1440, height: 900 },
  { name: "wide",              width: 1920, height: 1080 },
];

const browser = await chromium.launch();
const results = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
  page.on("pageerror", (e) => consoleErrors.push(String(e)));
  try {
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded", timeout: 25000 });
    // Scroll to map (after hero/notanagency)
    await page.waitForTimeout(800);
    // Find the map container by its inline-bound section
    const mapHandle = await page.locator('section:has(div[class*="h-[58vh]"])').first();
    await mapHandle.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(2200); // let map tiles render

    // Measure map container dimensions + overlay positions
    const stats = await page.evaluate(() => {
      const mapWrap = document.querySelector('section .relative.rounded-\\[24px\\], section .relative.rounded-\\[28px\\]')
        || document.querySelector('div[class*="rounded-[24px]"][class*="rounded-[28px]"]')
        || document.querySelector('div[class*="rounded-[28px]"]');
      const mapInner = document.querySelector('div[class*="h-[58vh]"]');
      const ctaCard = document.querySelector('[class*="max-w-md"][class*="md:w-[400px]"]')
        || document.querySelector('div[class*="md:absolute"][class*="md:left-5"]');
      const focusPill = document.querySelector('[class*="max-w-[88vw]"]');
      const zoomCtrls = document.querySelectorAll('button[aria-label="Zoom in"], button[aria-label="Zoom out"]');
      const rect = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
      };
      return {
        viewport: { w: window.innerWidth, h: window.innerHeight },
        mapWrap: rect(mapWrap),
        mapInner: rect(mapInner),
        ctaCard: rect(ctaCard),
        focusPill: rect(focusPill),
        zoomCtrlsCount: zoomCtrls.length,
        scrollY: window.scrollY,
        bodyOverflowX: getComputedStyle(document.body).overflowX,
        docWidth: document.documentElement.scrollWidth,
      };
    });

    // Heuristic flags
    const flags = [];
    if (stats.docWidth > stats.viewport.w + 2) flags.push(`HORIZONTAL_SCROLL doc=${stats.docWidth} vp=${stats.viewport.w}`);
    if (stats.mapInner && stats.mapInner.h < 360) flags.push(`MAP_TOO_SHORT h=${stats.mapInner.h}`);
    if (stats.mapInner && stats.mapInner.w < 280) flags.push(`MAP_TOO_NARROW w=${stats.mapInner.w}`);
    if (stats.ctaCard && stats.mapInner) {
      // On desktop CTA sits inside map (bottom-left). Check it doesn't exceed map width.
      if (vp.width >= 768 && stats.ctaCard.w + 40 > stats.mapInner.w) {
        flags.push(`CTA_OVERFLOWS_MAP cta=${stats.ctaCard.w} map=${stats.mapInner.w}`);
      }
    }

    await page.screenshot({ path: `/tmp/map-${vp.name}.png`, fullPage: false });

    results.push({ ...vp, stats, flags, consoleErrors });
    console.log(`✓ ${vp.name} (${vp.width}×${vp.height})  map=${stats.mapInner?.w}×${stats.mapInner?.h}  flags=${flags.join(", ") || "—"}`);
  } catch (e) {
    console.log(`✗ ${vp.name}: ${e.message}`);
    results.push({ ...vp, error: String(e) });
  } finally {
    await ctx.close();
  }
}

await browser.close();
console.log("\n--- summary ---");
for (const r of results) {
  if (r.error) { console.log(`${r.name}: ERROR ${r.error}`); continue; }
  console.log(`${r.name.padEnd(20)} flags: ${r.flags.length ? r.flags.join(" | ") : "ok"}`);
  if (r.consoleErrors.length) {
    const filt = r.consoleErrors.filter((e) => !/Failed to load resource|favicon|MapsRequestError|Google Maps|InvalidKey|RefererNotAllowed/i.test(e));
    if (filt.length) console.log(`  console: ${filt.slice(0, 3).join(" || ")}`);
  }
}
