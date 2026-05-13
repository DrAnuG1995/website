// Revert the 22 bulk-geocode coord changes back to the pre-Nominatim values.
// Keeps Eidsvold (151.1253, -25.3824) and Saint Lukes (151.2246, -33.8738)
// since those were verified ocean→land manual fixes.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const FILE = path.resolve("components/home/hospitals.ts");
const REVERTS = [
  ["Alexandra District Health", 145.7115, -37.1907],
  ["Bairnsdale Regional Health Service", 147.6242, -37.8228],
  ["Bendigo & District Aboriginal Co-operative", 144.2700, -36.7600],
  ["Bendigo Health", 144.2820, -36.7569],
  ["Bundaberg Hospital", 152.3489, -24.8661],
  ["Childers Hospital", 152.2789, -25.2367],
  ["Colac Area Health", 143.5845, -38.3398],
  ["Echuca Regional Health", 144.7501, -36.1316],
  ["Gayndah Hospital", 151.6181, -25.6228],
  ["Gin Gin Hospital", 151.9531, -24.9961],
  ["Hervey Bay Hospital", 152.8186, -25.2882],
  ["Hobart Private Hospital", 147.3257, -42.8826],
  ["Hollywood Private Hospital", 115.8069, -31.9802],
  ["Kalgoorlie Hospital", 121.4656, -30.7494],
  ["Maryborough Hospital", 152.7008, -25.5403],
  ["Mater Private Brisbane", 153.0250, -27.4830],
  ["Mater Private Mackay", 149.1860, -21.1440],
  ["Mater Private Rockhampton", 150.5117, -23.3780],
  ["Mater Private Townsville", 146.8169, -19.2589],
  ["Merri-bek Family Doctors", 144.9614, -37.7672],
  ["Monto Hospital", 151.1170, -24.8660],
  ["Swan Hill District Health", 143.5544, -35.3414],
  ["Tom Price Hospital", 117.7937, -22.6939],
];

let file = readFileSync(FILE, "utf8");
for (const [name, lng, lat] of REVERTS) {
  const escName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(name:\\s*"${escName}"[^}]*?lng:\\s*)([\\-\\d.]+)(,\\s*lat:\\s*)([\\-\\d.]+)`);
  const newLng = lng.toFixed(4);
  const newLat = lat.toFixed(4);
  const before = file;
  file = file.replace(re, `$1${newLng}$3${newLat}`);
  if (before === file) console.log(`!  could not patch: ${name}`);
  else console.log(`reverted: ${name} → ${newLng}, ${newLat}`);
}
writeFileSync(FILE, file);
console.log("\nDone.");
