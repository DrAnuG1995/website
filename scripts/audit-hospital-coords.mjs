import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "node:fs";

for (const path of [".env.local", ".env"]) {
  try {
    const raw = readFileSync(path, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        let v = m[2];
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
        process.env[m[1]] = v;
      }
    }
  } catch {}
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Same filter the homepage uses (lib/hospitals.ts → fetchActiveHospitals)
const { data, error } = await supabase
  .from("hospitals")
  .select("id, name, latitude, longitude, formatted_address")
  .eq("status", "active")
  .not("latitude", "is", null)
  .not("longitude", "is", null)
  .not("name", "ilike", "%trial%")
  .not("name", "ilike", "%test%")
  .not("name", "ilike", "%statdoctor%")
  .order("name", { ascending: true });

if (error) { console.error(error); process.exit(1); }

// Dedupe by normalised name (mirror lib/hospitals.ts:normaliseHospitalKey)
function normKey(name) {
  return name.toLowerCase().trim().replace(/\s+/g, " ").replace(/[.,!?;:]+$/, "").trim();
}
const seen = new Set();
const hospitals = data.filter((h) => {
  const k = normKey(h.name);
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});
console.log(`Active hospitals (deduped): ${hospitals.length}\n`);

function dist(a, b, c, d) {
  if ([a, b, c, d].some((v) => v == null)) return null;
  const R = 6371;
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(c - a);
  const dLng = toRad(d - b);
  const A = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a)) * Math.cos(toRad(c)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(A));
}

async function geocode(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=au&format=json&limit=1`;
  const res = await fetch(url, { headers: { "User-Agent": "StatDoctor-coord-audit/1.0 (anu@statdoctor.net)" } });
  if (!res.ok) return { ok: false, status: res.status };
  const j = await res.json();
  if (!Array.isArray(j) || j.length === 0) return { ok: false, status: "no_results" };
  return { ok: true, lat: parseFloat(j[0].lat), lng: parseFloat(j[0].lon), display: j[0].display_name };
}

const report = [];
let i = 0;
for (const h of hospitals) {
  i++;
  // Prefer the stored formatted_address (Google's own canonical string for
  // this place); fall back to "<name>, Australia".
  const q1 = h.formatted_address?.trim() || `${h.name}, Australia`;
  let g = await geocode(q1);
  // If addr-based geocode failed, retry with just the name.
  if (!g.ok && h.formatted_address) {
    await new Promise((r) => setTimeout(r, 1100));
    g = await geocode(`${h.name}, Australia`);
  }
  const d = g.ok ? dist(h.latitude, h.longitude, g.lat, g.lng) : null;
  report.push({
    name: h.name,
    address: h.formatted_address,
    current: [h.latitude, h.longitude],
    geocoded: g.ok ? [g.lat, g.lng] : null,
    distanceKm: d,
    geocodeStatus: g.ok ? "ok" : g.status,
    geocodedDisplay: g.display,
  });
  process.stderr.write(`  [${i}/${hospitals.length}] ${h.name.slice(0, 50).padEnd(52)} ${d == null ? "(no geocode)" : d.toFixed(2) + " km"}\n`);
  // Nominatim fair-use: ≤1 req/sec.
  await new Promise((r) => setTimeout(r, 1100));
}

report.sort((a, b) => (b.distanceKm ?? -1) - (a.distanceKm ?? -1));

let warned = 0;
let major = 0;
console.log("\n=== > 5 km off (major) ===");
for (const r of report) {
  if (r.distanceKm == null) continue;
  if (r.distanceKm > 5) {
    major++;
    console.log(`  ${r.distanceKm.toFixed(1)} km  ${r.name}`);
    console.log(`     current:  [${r.current[0]}, ${r.current[1]}]`);
    console.log(`     OSM says: [${r.geocoded[0]}, ${r.geocoded[1]}]  ${r.geocodedDisplay}`);
  }
}
if (major === 0) console.log("  (none)");

console.log("\n=== 1–5 km off (minor — usually same campus, fine) ===");
for (const r of report) {
  if (r.distanceKm == null) continue;
  if (r.distanceKm > 1 && r.distanceKm <= 5) {
    warned++;
    console.log(`  ${r.distanceKm.toFixed(2)} km  ${r.name}`);
  }
}
if (warned === 0) console.log("  (none)");

const ok = report.filter((r) => r.distanceKm != null && r.distanceKm <= 1).length;
const failed = report.filter((r) => r.distanceKm == null).length;
console.log(`\n=== Summary ===`);
console.log(`Within 1 km of geocoded location: ${ok}`);
console.log(`1–5 km off (probably ok):         ${warned}`);
console.log(`> 5 km off (review):              ${major}`);
console.log(`Geocode failed (skip):            ${failed}`);

writeFileSync("/tmp/hospital-audit.json", JSON.stringify(report, null, 2));
console.log(`\nFull report → /tmp/hospital-audit.json`);
