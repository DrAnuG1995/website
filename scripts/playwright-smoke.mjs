// Playwright smoke test, exercises the homepage, captures screenshots at
// desktop + mobile viewports, logs any console errors and 404s. Run with:
//   node scripts/playwright-smoke.mjs
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const URL = process.env.URL ?? "http://localhost:3000";
const OUT = "scripts/playwright-out";

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const findings = { errors: [], warnings: [], failedRequests: [], steps: [] };

async function newPage(viewport, label) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  page.on("console", (msg) => {
    const t = msg.type();
    if (t === "error") findings.errors.push(`[${label}] ${msg.text()}`);
    if (t === "warning") findings.warnings.push(`[${label}] ${msg.text()}`);
  });
  page.on("requestfailed", (req) => {
    findings.failedRequests.push(`[${label}] ${req.url()}, ${req.failure()?.errorText}`);
  });
  page.on("response", (res) => {
    if (res.status() >= 400) {
      findings.failedRequests.push(`[${label}] ${res.url()}, HTTP ${res.status()}`);
    }
  });
  return { ctx, page };
}

async function step(label, fn) {
  try {
    await fn();
    findings.steps.push(`✓ ${label}`);
  } catch (e) {
    findings.steps.push(`✗ ${label}, ${e.message}`);
  }
}

// Desktop pass
const desktop = await newPage({ width: 1440, height: 900 }, "desktop");
await step("desktop: load /", async () => {
  await desktop.page.goto(URL, { waitUntil: "networkidle", timeout: 30_000 });
});
await step("desktop: hero map screenshot", async () => {
  await desktop.page.waitForTimeout(4500); // intro + idle
  await desktop.page.screenshot({ path: `${OUT}/desktop-01-hero.png` });
});
await step("desktop: scroll to feed", async () => {
  await desktop.page.evaluate(() => window.scrollTo(0, 1800));
  await desktop.page.waitForTimeout(900);
  await desktop.page.screenshot({ path: `${OUT}/desktop-02-feed.png` });
});
await step("desktop: scroll to faq", async () => {
  await desktop.page.evaluate(() =>
    window.scrollTo(0, document.body.scrollHeight - 1400)
  );
  await desktop.page.waitForTimeout(700);
  await desktop.page.screenshot({ path: `${OUT}/desktop-03-faq.png` });
});
await step("desktop: scroll to footer", async () => {
  await desktop.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await desktop.page.waitForTimeout(600);
  await desktop.page.screenshot({ path: `${OUT}/desktop-04-footer.png` });
});
await step("desktop: open download modal", async () => {
  await desktop.page.evaluate(() => window.scrollTo(0, 0));
  await desktop.page.waitForTimeout(400);
  await desktop.page.click("text=Download App");
  await desktop.page.waitForTimeout(700);
  await desktop.page.screenshot({ path: `${OUT}/desktop-05-modal.png` });
  await desktop.page.keyboard.press("Escape");
});
await step("desktop: load /for-doctors", async () => {
  await desktop.page.goto(`${URL}/for-doctors`, { waitUntil: "networkidle" });
  await desktop.page.waitForTimeout(800);
  await desktop.page.screenshot({ path: `${OUT}/desktop-06-fordoctors.png` });
});
await step("desktop: load /hospitals", async () => {
  await desktop.page.goto(`${URL}/hospitals`, { waitUntil: "networkidle" });
  await desktop.page.waitForTimeout(800);
  await desktop.page.screenshot({ path: `${OUT}/desktop-07-hospitals.png`, fullPage: true });
});
await desktop.ctx.close();

// Mobile pass, iPhone 14 Pro viewport
const mobile = await newPage({ width: 393, height: 852 }, "mobile");
await step("mobile: load /", async () => {
  await mobile.page.goto(URL, { waitUntil: "networkidle" });
  await mobile.page.waitForTimeout(4500);
  await mobile.page.screenshot({ path: `${OUT}/mobile-01-hero.png` });
});
await step("mobile: scroll mid", async () => {
  await mobile.page.evaluate(() => window.scrollTo(0, 2400));
  await mobile.page.waitForTimeout(800);
  await mobile.page.screenshot({ path: `${OUT}/mobile-02-mid.png` });
});
await step("mobile: scroll bottom", async () => {
  await mobile.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await mobile.page.waitForTimeout(600);
  await mobile.page.screenshot({ path: `${OUT}/mobile-03-bottom.png` });
});
await step("mobile: tap nav download", async () => {
  await mobile.page.evaluate(() => window.scrollTo(0, 0));
  await mobile.page.waitForTimeout(400);
  await mobile.page.tap("text=Download App");
  await mobile.page.waitForTimeout(700);
  await mobile.page.screenshot({ path: `${OUT}/mobile-04-modal.png` });
});
await mobile.ctx.close();

await browser.close();

console.log("\n=== Playwright smoke ===");
console.log("Steps:");
findings.steps.forEach((s) => console.log("  " + s));
if (findings.errors.length) {
  console.log("\nConsole errors:");
  findings.errors.forEach((e) => console.log("  " + e));
} else console.log("\nNo console errors.");
if (findings.warnings.length) {
  console.log("\nConsole warnings:");
  findings.warnings.slice(0, 10).forEach((w) => console.log("  " + w));
  if (findings.warnings.length > 10)
    console.log(`  …and ${findings.warnings.length - 10} more`);
}
if (findings.failedRequests.length) {
  console.log("\nFailed requests:");
  findings.failedRequests.forEach((r) => console.log("  " + r));
} else console.log("\nNo failed requests.");
console.log(`\nScreenshots in ${OUT}/\n`);
