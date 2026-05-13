// Re-geocode every hospital against Nominatim. For each row, search by name
// + state, then pick the result closest to the existing coord (within 50 km).
// Print proposed updates as a unified delta. Apply only after review.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const FILE = path.resolve("components/home/hospitals.ts");
const APPLY = process.argv.includes("--apply");

const file = readFileSync(FILE, "utf8");
const rows = [];
const re = /name:\s*"([^"]+)"[^}]*?state:\s*"([A-Z]+)"[^}]*?lng:\s*([\-\d.]+),\s*lat:\s*([\-\d.]+)/g;
let m;
while ((m = re.exec(file)) !== null) {
  rows.push({ name: m[1], state: m[2], lng: parseFloat(m[3]), lat: parseFloat(m[4]) });
}
console.log(`Loaded ${rows.length} hospitals.\n`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const stateToFull = {
  VIC: "Victoria", NSW: "New South Wales", QLD: "Queensland",
  WA: "Western Australia", TAS: "Tasmania", ACT: "Australian Capital Territory",
  SA: "South Australia", NT: "Northern Territory",
};
function distanceKm(a, b) {
  const R = 6371;
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const proposals = [];
for (const h of rows) {
  const q = encodeURIComponent(`${h.name}, ${stateToFull[h.state]}, Australia`);
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${q}&limit=5&countrycodes=au`;
  let result = null;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "statdoctor-regeocode/1.0 (Admin@statdoctor.net)" },
    });
    const matches = await res.json();
    if (Array.isArray(matches) && matches.length) {
      // pick closest match to existing coord, within 50 km
      const scored = matches
        .map((r) => {
          const lat = parseFloat(r.lat);
          const lng = parseFloat(r.lon);
          return { lat, lng, d: distanceKm(h, { lat, lng }), display: r.display_name, type: r.type, class: r.class };
        })
        .filter((r) => r.d <= 50)
        .sort((a, b) => a.d - b.d);
      result = scored[0] ?? null;
    }
  } catch (e) {
    console.log(`!  ${h.name}: ${e.message}`);
  }

  if (result) {
    const dMeters = Math.round(result.d * 1000);
    if (dMeters >= 30) {
      proposals.push({ ...h, newLng: result.lng, newLat: result.lat, dMeters, display: result.display });
      console.log(`Δ ${dMeters.toString().padStart(5)}m  ${h.state}  ${h.name}`);
      console.log(`     old: ${h.lng}, ${h.lat}`);
      console.log(`     new: ${result.lng.toFixed(4)}, ${result.lat.toFixed(4)}  (${result.class}/${result.type})`);
      console.log(`     ${result.display}`);
    } else {
      console.log(`✓        ${h.state}  ${h.name}  (within ${dMeters}m)`);
    }
  } else {
    console.log(`?        ${h.state}  ${h.name}  (no Nominatim match within 50km)`);
  }
  await sleep(1100);
}

console.log(`\n=== ${proposals.length} proposed updates ===\n`);

if (!APPLY) {
  console.log("Run with --apply to write these to hospitals.ts");
  process.exit(0);
}

let updated = file;
for (const p of proposals) {
  // Match the exact existing line for this hospital and rewrite lng/lat.
  // Anchor on the name to avoid collisions.
  const escName = p.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const lineRe = new RegExp(
    `(name:\\s*"${escName}"[^}]*?lng:\\s*)([\\-\\d.]+)(,\\s*lat:\\s*)([\\-\\d.]+)`,
  );
  const newLng = p.newLng.toFixed(4);
  const newLat = p.newLat.toFixed(4);
  const before = updated;
  updated = updated.replace(lineRe, `$1${newLng}$3${newLat}`);
  if (before === updated) {
    console.log(`!  could not patch line for: ${p.name}`);
  } else {
    console.log(`patched: ${p.name}`);
  }
}
writeFileSync(FILE, updated);
console.log("\nhospitals.ts updated.");
