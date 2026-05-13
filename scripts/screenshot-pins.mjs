// Pin verifier. For each hospital, jumps the map to its coordinate then asks
// Mapbox itself "is there a water feature at this pixel?" via queryRenderedFeatures.
// Far more reliable than reading the WebGL canvas (which is double-buffered).
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const OUT = path.resolve("scripts/pin-screens");
mkdirSync(OUT, { recursive: true });

const file = readFileSync(path.resolve("components/home/hospitals.ts"), "utf8");
const rows = [];
const re = /name:\s*"([^"]+)"[^}]*?state:\s*"([A-Z]+)"[^}]*?lng:\s*([\-\d.]+),\s*lat:\s*([\-\d.]+)/g;
let m;
while ((m = re.exec(file)) !== null) {
  rows.push({ idx: rows.length, name: m[1], state: m[2], lng: parseFloat(m[3]), lat: parseFloat(m[4]) });
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForSelector(".mapboxgl-canvas", { timeout: 60000 });
await page.waitForFunction(() => !!window.__sdMap && window.__sdMap.isStyleLoaded(), { timeout: 30000 });
await page.waitForTimeout(1500);

// List water-related layers Mapbox is rendering
const waterLayers = await page.evaluate(() => {
  const map = window.__sdMap;
  return map.getStyle().layers
    .filter((l) => /water/i.test(l.id) || (l["source-layer"] && /water/i.test(l["source-layer"])))
    .map((l) => l.id);
});
console.log(`Water layers in style: ${waterLayers.join(", ")}\n`);

const flagged = [];
for (const h of rows) {
  const onWater = await page.evaluate(({ lng, lat, layers }) => {
    const map = window.__sdMap;
    map.jumpTo({ center: [lng, lat], zoom: 13, pitch: 0, bearing: 0 });
    return new Promise((resolve) => {
      const settle = () => {
        const pt = map.project([lng, lat]);
        const features = map.queryRenderedFeatures(
          [[pt.x - 1, pt.y - 1], [pt.x + 1, pt.y + 1]],
          { layers },
        );
        resolve(features.length > 0);
      };
      if (map.loaded() && !map.isMoving()) settle();
      else map.once("idle", settle);
    });
  }, { lng: h.lng, lat: h.lat, layers: waterLayers });

  const tag = onWater ? "❌ WATER" : "✓ land";
  console.log(`${tag.padEnd(10)} ${h.state.padEnd(3)} ${h.name}`);
  if (onWater) {
    flagged.push(h);
    await page.screenshot({ path: path.join(OUT, `flagged-${h.idx}-${h.name.replace(/[^a-z0-9]+/gi, "-")}.png`) });
  }
}

console.log("\n=== Flagged ===");
if (flagged.length === 0) console.log("All pins on land.");
else flagged.forEach((f) => console.log(`- ${f.name} (${f.lng}, ${f.lat})`));

await browser.close();
