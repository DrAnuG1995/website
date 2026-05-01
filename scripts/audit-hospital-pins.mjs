// Coordinate audit. Hits Nominatim reverse-geocoding for every hospital and
// flags any pin that comes back as ocean / sea / no-result.
// Usage: node scripts/audit-hospital-pins.mjs
import { HOSPITALS } from "../components/home/hospitals.ts";

// Tiny TS-stripping import shim — Node 22 ESM can require type stripping.
// Easier: read the data as plain JS via a tiny duplicate. Below we re-import
// only the array, stripping types through a regex pre-pass.
import { readFileSync } from "node:fs";
import path from "node:path";

const file = readFileSync(path.resolve("components/home/hospitals.ts"), "utf8");
// Pull out lng/lat/name/state with a permissive regex over each entry line.
const rows = [];
const re = /name:\s*"([^"]+)"[^}]*?state:\s*"([A-Z]+)"[^}]*?lng:\s*([\-\d.]+),\s*lat:\s*([\-\d.]+)/g;
let m;
while ((m = re.exec(file)) !== null) {
  rows.push({ name: m[1], state: m[2], lng: parseFloat(m[3]), lat: parseFloat(m[4]) });
}

console.log(`Found ${rows.length} hospitals — auditing…\n`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const flagged = [];

for (const h of rows) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${h.lat}&lon=${h.lng}&zoom=14`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "statdoctor-audit/1.0 (anu@statdoctor.net)" },
    });
    const j = await res.json();
    const display = j.display_name ?? "(no result)";
    const onLand = j && j.address && (j.address.country === "Australia" || j.address.country_code === "au");
    const flag = !onLand ? "❌ OCEAN/NO-MATCH" : "✓";
    console.log(`${flag.padEnd(18)} ${h.state} · ${h.name}`);
    if (!onLand) {
      flagged.push({ ...h, display });
      console.log(`    → ${display}`);
    }
  } catch (e) {
    console.log(`?   ${h.name}: error ${e.message}`);
  }
  await sleep(1100); // Nominatim rate limit: 1 req/sec
}

console.log("\n=== Flagged pins ===");
if (flagged.length === 0) console.log("All on land.");
else flagged.forEach((f) => console.log(`- ${f.name} (${f.lng}, ${f.lat}) → ${f.display}`));
