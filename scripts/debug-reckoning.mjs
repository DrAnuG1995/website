import { chromium } from "playwright";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
page.on("console", (msg) => console.log("[page]", msg.text()));

await page.goto("http://localhost:3001/?nolenis=1", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

// Scroll to Chapter 02 Beat B (middle of the section)
for (const y of [1800, 2700, 3200, 3600, 4100]) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
  await page.waitForTimeout(600);
  const info = await page.evaluate(() => {
    const section = Array.from(document.querySelectorAll("section")).find((s) =>
      s.textContent?.includes("The Reckoning")
    );
    if (!section) return { err: "no section" };
    const r = section.getBoundingClientRect();
    const sticky = section.querySelector(".sticky");
    const sr = sticky?.getBoundingClientRect();
    const beats = Array.from(sticky?.querySelectorAll(":scope > div > div") || []).slice(1, 4);
    return {
      scrollY: window.scrollY,
      section: { top: r.top, bottom: r.bottom, height: r.height },
      sticky: sr ? { top: sr.top, bottom: sr.bottom } : null,
      beats: beats.map((b) => ({
        opacity: getComputedStyle(b).opacity,
        transform: getComputedStyle(b).transform.slice(0, 60),
      })),
    };
  });
  console.log(`y=${y} →`, JSON.stringify(info));
}

await browser.close();
