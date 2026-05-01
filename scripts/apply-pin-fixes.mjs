// Apply the verified per-hospital coordinate fixes. Each entry was either:
// (a) confirmed by a strict Nominatim match (display_name contains the hospital
//     name with token-overlap >= 60% AND within 30 km of existing coord), or
// (b) hand-verified against OSM with the explicit street name in the result.
// Anything not in this list keeps its existing coord.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const FILE = path.resolve("components/home/hospitals.ts");
const FIXES = [
  // strict-match verified
  ["Alexandra District Health", 145.7167, -37.1952],
  ["Bairnsdale Regional Health Service", 147.6079, -37.8314],
  ["Bendigo & District Aboriginal Co-operative", 144.2786, -36.7287],
  ["Bendigo Health", 144.2811, -36.7491],
  ["Bundaberg Hospital", 152.3358, -24.8688],
  ["Childers Hospital", 152.2732, -25.2395],
  ["Colac Area Health", 143.5828, -38.3413],
  ["Echuca Regional Health", 144.7476, -36.1384],
  ["Gayndah Hospital", 151.6044, -25.6313],
  ["Gin Gin Hospital", 151.9534, -24.9860],
  ["Hervey Bay Hospital", 152.8209, -25.2988],
  ["Hobart Private Hospital", 147.3298, -42.8807],
  ["Hollywood Private Hospital", 115.8095, -31.9689],
  ["Kalgoorlie Hospital", 121.4705, -30.7409],
  ["Knox Private Hospital ED", 145.2278, -37.8495],
  ["Maryborough Hospital", 152.6906, -25.5218],
  ["Mater Private Mackay", 149.1662, -21.1310],
  ["Mater Private Rockhampton", 150.4978, -23.3980],
  ["Mater Private Townsville", 146.7872, -19.2887],
  ["Merri-bek Family Doctors", 144.9455, -37.7542],
  ["Swan Hill District Health", 143.5563, -35.3406],
  ["Tom Price Hospital", 117.7899, -22.6958],
  // hand-verified from OSM result with correct street name
  ["Mater Private Brisbane", 153.0288, -27.4843],     // Vulture Street, South Brisbane
  ["Monto Hospital", 151.1252, -24.8654],             // Newton Street, Monto
  ["Biggenden Multipurpose Health Centre", 152.0510, -25.5063], // Alice Street, Biggenden
  ["Noosa Private Hospital", 153.0457, -26.4026],     // Goodchap Street, Noosaville
  ["Yarrawonga Health", 146.0042, -36.0102],          // Belmore Street, Yarrawonga
  ["Portland District Health", 141.6063, -38.3414],   // Bentinck Street, Portland
  ["Friendly Society Private — Bundaberg", 152.3425, -24.8708], // Crofton St, Bundaberg West
];

let file = readFileSync(FILE, "utf8");
let changed = 0;
for (const [name, lng, lat] of FIXES) {
  const escName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(name:\\s*"${escName}"[^}]*?lng:\\s*)([\\-\\d.]+)(,\\s*lat:\\s*)([\\-\\d.]+)`);
  const newLng = lng.toFixed(4);
  const newLat = lat.toFixed(4);
  const before = file;
  file = file.replace(re, `$1${newLng}$3${newLat}`);
  if (before === file) {
    console.log(`!  could not patch: ${name}`);
  } else {
    console.log(`patched: ${name} → ${newLng}, ${newLat}`);
    changed++;
  }
}
writeFileSync(FILE, file);
console.log(`\n${changed}/${FIXES.length} updates applied.`);
