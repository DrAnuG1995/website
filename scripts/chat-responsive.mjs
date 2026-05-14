// Visual smoke check: chatbot widget at common viewports.
// Captures bubble (closed) + panel (open) at each viewport. Fails loudly if
// the bubble or composer falls off-screen or if the panel isn't visible.
//
// Usage: node scripts/chat-responsive.mjs
// Requires: dev server on http://localhost:3000

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const URL = "http://localhost:3000/";
const OUT = "scripts/screens/chat-responsive";

const VIEWPORTS = [
  { name: "iphone-se",     w: 375,  h: 667,  isMobile: true  },
  { name: "iphone-14",     w: 390,  h: 844,  isMobile: true  },
  { name: "iphone-14-pro", w: 430,  h: 932,  isMobile: true  },
  { name: "ipad-mini",     w: 768,  h: 1024, isMobile: false },
  { name: "ipad-pro",      w: 1024, h: 1366, isMobile: false },
  { name: "laptop",        w: 1280, h: 800,  isMobile: false },
  { name: "desktop",       w: 1440, h: 900,  isMobile: false },
  { name: "wide",          w: 1920, h: 1080, isMobile: false },
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const results = [];

for (const v of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: v.w, height: v.h },
    deviceScaleFactor: v.isMobile ? 2 : 1,
    isMobile: v.isMobile,
    hasTouch: v.isMobile,
  });
  const page = await ctx.newPage();
  const issues = [];

  try {
    await page.goto(URL, { waitUntil: "networkidle", timeout: 20_000 });
    // Give the bubble's 800ms entrance animation a moment to settle.
    await page.waitForTimeout(1200);

    // --- closed state ---
    const bubble = page.locator('button[aria-label="Open StatDoctor chat"]');
    const bubbleCount = await bubble.count();
    if (bubbleCount === 0) {
      issues.push("bubble not found in DOM");
    } else {
      const box = await bubble.boundingBox();
      if (!box) {
        issues.push("bubble has no bounding box (display:none?)");
      } else {
        const offRight  = box.x + box.width  > v.w;
        const offBottom = box.y + box.height > v.h;
        const offLeft   = box.x < 0;
        const offTop    = box.y < 0;
        if (offRight || offBottom || offLeft || offTop) {
          issues.push(
            `bubble out of viewport: x=${box.x.toFixed(0)} y=${box.y.toFixed(0)} ` +
            `w=${box.width.toFixed(0)} h=${box.height.toFixed(0)} (vp ${v.w}x${v.h})`
          );
        }
        if (box.height > 60) {
          issues.push(`bubble too tall: ${box.height.toFixed(0)}px (expected ~48)`);
        }
      }
    }
    await page.screenshot({
      path: `${OUT}/${v.name}-closed.png`,
      clip: {
        x: Math.max(0, v.w - 280),
        y: Math.max(0, v.h - 120),
        width: Math.min(280, v.w),
        height: Math.min(120, v.h),
      },
    });

    // --- open state ---
    if (bubbleCount > 0) {
      await bubble.click();
      // Panel entrance is ~280ms.
      await page.waitForTimeout(500);

      const panel = page.locator('[role="dialog"][aria-label="StatDoctor chat"]');
      if ((await panel.count()) === 0) {
        issues.push("panel did not appear after click");
      } else {
        const pBox = await panel.boundingBox();
        if (!pBox) {
          issues.push("panel has no bounding box");
        } else {
          // Panel must be visible within viewport.
          if (pBox.width < 200) {
            issues.push(`panel suspiciously narrow: ${pBox.width.toFixed(0)}px`);
          }
          if (pBox.height < 200) {
            issues.push(`panel suspiciously short: ${pBox.height.toFixed(0)}px`);
          }
          if (pBox.x < 0 || pBox.y < 0 ||
              pBox.x + pBox.width  > v.w ||
              pBox.y + pBox.height > v.h) {
            issues.push(
              `panel out of viewport: x=${pBox.x.toFixed(0)} y=${pBox.y.toFixed(0)} ` +
              `w=${pBox.width.toFixed(0)} h=${pBox.height.toFixed(0)}`
            );
          }
          // Mobile: should be effectively full screen.
          if (v.isMobile && pBox.width < v.w * 0.95) {
            issues.push(
              `mobile panel not full-width: ${pBox.width.toFixed(0)}px of ${v.w}px`
            );
          }
        }

        // Composer textarea + send button must both be in-viewport.
        const composer = panel.locator("textarea");
        const sendBtn  = panel.locator('button[aria-label="Send message"]');
        const tBox = await composer.boundingBox();
        const sBox = await sendBtn.boundingBox();
        if (!tBox) issues.push("composer textarea not visible");
        if (!sBox) issues.push("send button not visible");
        if (tBox && (tBox.y + tBox.height > v.h || tBox.x + tBox.width > v.w)) {
          issues.push(
            `composer textarea out of viewport: y=${(tBox.y + tBox.height).toFixed(0)} of ${v.h}`
          );
        }
        if (sBox && (sBox.y + sBox.height > v.h || sBox.x + sBox.width > v.w)) {
          issues.push(
            `send button out of viewport: y=${(sBox.y + sBox.height).toFixed(0)} of ${v.h}`
          );
        }
      }

      await page.screenshot({ path: `${OUT}/${v.name}-open.png`, fullPage: false });

      // Try to type and assert focus works.
      const ta = panel.locator("textarea");
      if (await ta.count() > 0) {
        await ta.click();
        await ta.type("test", { delay: 10 });
        const val = await ta.inputValue();
        if (val !== "test") issues.push(`textarea typing broken: got "${val}"`);
      }
    }
  } catch (e) {
    issues.push(`exception: ${e.message}`);
  }

  results.push({ viewport: v, issues });
  await ctx.close();
}

await browser.close();

console.log("\n=== Chatbot responsiveness report ===\n");
let bad = 0;
for (const r of results) {
  const tag = r.issues.length === 0 ? "OK   " : "FAIL ";
  if (r.issues.length > 0) bad++;
  console.log(
    `${tag} ${r.viewport.name.padEnd(15)} ${String(r.viewport.w).padStart(4)}x${r.viewport.h}`
  );
  for (const i of r.issues) console.log(`        - ${i}`);
}
console.log(`\nScreenshots: ${OUT}/`);
console.log(`${results.length - bad}/${results.length} viewports clean.\n`);
process.exit(bad === 0 ? 0 : 1);
