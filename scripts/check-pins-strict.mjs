// Strict per-hospital coordinate check.
// For each hospital, search Nominatim by exact name + state. Only propose
// an update if the Nominatim display_name actually contains a strong match
// for the hospital name (token overlap), and the result is within 30 km of
// the existing coord. Skip everything else — don't guess.
//
// Usage:
//   node scripts/check-pins-strict.mjs            # dry run
//   node scripts/check-pins-strict.mjs --apply    # write to hospitals.ts
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
const stateFull = {
  VIC: "Victoria", NSW: "New South Wales", QLD: "Queensland",
  WA: "Western Australia", TAS: "Tasmania", ACT: "Australian Capital Territory",
  SA: "South Australia", NT: "Northern Territory",
};

const STOP = new Set([
  "the","and","of","a","an","at","in","on","for","to","de","la","st",
  "centre","center","clinic","medical","health","hospital","practice",
  "service","services","family","doctors","ed","gp","private","general",
  "public","district","regional","co","cooperative","cooperation",
  "multipurpose","plaza","group","care","corp","corporation"
]);
function tokens(s) {
  return s.toLowerCase().replace(/[—–\-–_,.()]/g, " ").split(/\s+/).filter((t) => t && !STOP.has(t) && t.length > 2);
}
function overlapScore(hospitalName, displayName) {
  const a = tokens(hospitalName);
  const b = new Set(tokens(displayName));
  if (a.length === 0) return 0;
  let hit = 0;
  for (const t of a) if (b.has(t)) hit++;
  return hit / a.length;
}
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
const skipped = [];

for (const h of rows) {
  // Strip "ED" / "—" suffixes that confuse Nominatim
  const cleanName = h.name.replace(/\s*[—–-]\s*/g, " ").replace(/\bED\b/g, "").trim();
  const q = encodeURIComponent(`${cleanName}, ${stateFull[h.state]}, Australia`);
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${q}&limit=8&countrycodes=au&addressdetails=0`;
  let chosen = null;
  let allMatches = [];
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "statdoctor-strict/1.0 (anu@statdoctor.net)" },
    });
    const matches = await res.json();
    if (Array.isArray(matches)) {
      // Score every match by (name overlap × proximity)
      allMatches = matches.map((r) => {
        const lat = parseFloat(r.lat);
        const lng = parseFloat(r.lon);
        return {
          lat, lng,
          d: distanceKm(h, { lat, lng }),
          display: r.display_name,
          klass: r.class,
          type: r.type,
          score: overlapScore(cleanName, r.display_name),
        };
      });
      // Tight filter: name-overlap >= 0.6 AND within 30 km of existing coord
      const candidates = allMatches
        .filter((r) => r.score >= 0.6 && r.d <= 30)
        .sort((a, b) => b.score - a.score || a.d - b.d);
      chosen = candidates[0] ?? null;
    }
  } catch (e) {
    console.log(`!  ${h.name}: ${e.message}`);
  }

  if (chosen) {
    const dMeters = Math.round(chosen.d * 1000);
    if (dMeters >= 50) {
      proposals.push({ ...h, newLng: chosen.lng, newLat: chosen.lat, dMeters, display: chosen.display, score: chosen.score });
      console.log(`Δ ${dMeters.toString().padStart(5)}m  ${h.state}  ${h.name}`);
      console.log(`     score: ${chosen.score.toFixed(2)}  ${chosen.klass}/${chosen.type}`);
      console.log(`     ${chosen.display}`);
    } else {
      console.log(`✓ tight  ${h.state}  ${h.name}  (${dMeters}m, score ${chosen.score.toFixed(2)})`);
    }
  } else {
    skipped.push({ ...h, allMatches });
    const top = allMatches.slice(0, 2).map((r) => `[${r.score.toFixed(2)} / ${Math.round(r.d)}km] ${r.display.slice(0, 80)}`).join(" | ");
    console.log(`?        ${h.state}  ${h.name}  (no strict match; top: ${top || "none"})`);
  }
  await sleep(1100);
}

console.log(`\n=== ${proposals.length} proposed updates, ${skipped.length} skipped ===\n`);

if (!APPLY) {
  console.log("Run with --apply to write proposals to hospitals.ts");
  process.exit(0);
}

let updated = file;
for (const p of proposals) {
  const escName = p.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const lineRe = new RegExp(`(name:\\s*"${escName}"[^}]*?lng:\\s*)([\\-\\d.]+)(,\\s*lat:\\s*)([\\-\\d.]+)`);
  const newLng = p.newLng.toFixed(4);
  const newLat = p.newLat.toFixed(4);
  const before = updated;
  updated = updated.replace(lineRe, `$1${newLng}$3${newLat}`);
  if (before === updated) console.log(`!  could not patch: ${p.name}`);
  else console.log(`patched: ${p.name}`);
}
writeFileSync(FILE, updated);
console.log("\nhospitals.ts updated.");
