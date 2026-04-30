import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, "../public/statdoctor-logo.png");
const OUT = path.resolve(__dirname, "../public/statdoctor-logo.png");

// The lavender background sits around #cdc9e9 / #c7c2e3. We nuke any pixel
// where R, G, B all sit in the pale-purple range *and* the pixel isn't already
// dark blue (the logo itself). Threshold tuned to preserve the stethoscope tail.
const isBackground = (r, g, b) => {
  // logo strokes are deep blue: low R, low G, very high B → keep those
  if (b > 180 && r < 90 && g < 100) return false;
  // lavender background: relatively bright, R ≈ G < B, all > 170
  if (r > 175 && g > 170 && b > 195 && Math.abs(r - g) < 25 && b - r < 60) return true;
  return false;
};

const img = sharp(SRC).ensureAlpha();
const meta = await img.metadata();
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

const out = Buffer.alloc(data.length);
data.copy(out);

let changed = 0;
for (let i = 0; i < out.length; i += 4) {
  const r = out[i];
  const g = out[i + 1];
  const b = out[i + 2];
  if (isBackground(r, g, b)) {
    out[i + 3] = 0; // transparent
    changed++;
  }
}

await sharp(out, {
  raw: {
    width: info.width,
    height: info.height,
    channels: 4,
  },
})
  .png()
  .toFile(OUT);

console.log(
  `Processed ${meta.width}x${meta.height}px · ${changed} pixels nuked · saved to ${path.relative(process.cwd(), OUT)}`
);
