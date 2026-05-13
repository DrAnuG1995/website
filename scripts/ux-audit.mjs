// UX/UI audit — visits each page, measures Web Vitals, lists heavy
// animation/render hot-spots and friction signals. Output is a punch list,
// not a screenshot dump.
import { chromium } from "playwright";

const BASE = process.env.URL ?? "http://localhost:3000";
const PAGES = ["/", "/for-doctors", "/hospitals", "/about", "/partners", "/contact"];

const browser = await chromium.launch();
const results = [];

for (const route of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const errors = [];
  const slowResources = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 200)); });
  page.on("response", (r) => {
    const url = r.url();
    if (r.status() >= 400) errors.push(`HTTP ${r.status()}: ${url}`);
  });

  const url = BASE + route;
  const t0 = Date.now();
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  } catch (e) {
    results.push({ route, error: e.message });
    await ctx.close();
    continue;
  }
  const loadMs = Date.now() - t0;

  // Web vitals via PerformanceObserver
  const vitals = await page.evaluate(async () => {
    const out = { lcp: null, cls: 0, longTasks: 0, longTaskMs: 0 };
    try {
      const lcpPromise = new Promise((res) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const last = entries[entries.length - 1];
          out.lcp = Math.round(last?.renderTime || last?.loadTime || 0);
        }).observe({ type: "largest-contentful-paint", buffered: true });
        setTimeout(res, 1800);
      });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (!e.hadRecentInput) out.cls += e.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          out.longTasks += 1;
          out.longTaskMs += e.duration;
        }
      }).observe({ type: "longtask", buffered: true });
      await lcpPromise;
    } catch {}
    return out;
  });

  // Sample animation activity by scrolling, measuring frame-time spread
  const animationProfile = await page.evaluate(async () => {
    return await new Promise((res) => {
      const samples = [];
      let last = performance.now();
      let raf;
      const tick = () => {
        const now = performance.now();
        samples.push(now - last);
        last = now;
        if (samples.length < 120) raf = requestAnimationFrame(tick);
        else res(samples);
      };
      // Drive a smooth scroll while sampling.
      window.scrollTo({ top: 0 });
      let y = 0;
      const max = document.body.scrollHeight - window.innerHeight;
      const step = max / 120;
      const driver = setInterval(() => { y = Math.min(max, y + step); window.scrollTo(0, y); }, 16);
      raf = requestAnimationFrame(tick);
      setTimeout(() => { clearInterval(driver); }, 2000);
    });
  });

  const sorted = [...animationProfile].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const slowFrames = animationProfile.filter((d) => d > 32).length;

  // Count pop-ups / modals / motion divs / images
  const counts = await page.evaluate(() => ({
    motionDivs: document.querySelectorAll("[style*='transform'],[style*='opacity']").length,
    images: document.querySelectorAll("img").length,
    largeImages: Array.from(document.querySelectorAll("img")).filter((i) => i.naturalWidth > 2000).map((i) => i.src.slice(0, 80)),
    iframes: document.querySelectorAll("iframe").length,
    videos: document.querySelectorAll("video").length,
    fixedElements: Array.from(document.querySelectorAll("*")).filter((e) => {
      const s = getComputedStyle(e);
      return s.position === "fixed" && s.display !== "none" && e.getBoundingClientRect().width > 50;
    }).length,
  }));

  results.push({
    route,
    loadMs,
    lcpMs: vitals.lcp,
    cls: Number(vitals.cls.toFixed(3)),
    longTasks: vitals.longTasks,
    longTaskMs: Math.round(vitals.longTaskMs),
    medianFrameMs: Number(median.toFixed(1)),
    p95FrameMs: Number(p95.toFixed(1)),
    slowFrames,
    motionEls: counts.motionDivs,
    images: counts.images,
    bigImages: counts.largeImages.length,
    bigImagePaths: counts.largeImages.slice(0, 3),
    videos: counts.videos,
    fixedElements: counts.fixedElements,
    errors: errors.slice(0, 6),
  });

  await ctx.close();
}

await browser.close();

const fmt = (n) => (n == null ? "—" : String(n));
console.log("\nUX/UI audit\n" + "─".repeat(60));
for (const r of results) {
  if (r.error) { console.log(`\n${r.route}\n  load failed: ${r.error}`); continue; }
  console.log(`\n${r.route}`);
  console.log(`  load=${r.loadMs}ms  LCP=${fmt(r.lcpMs)}ms  CLS=${r.cls}  longTasks=${r.longTasks} (${r.longTaskMs}ms)`);
  console.log(`  scroll-frames: median=${r.medianFrameMs}ms  p95=${r.p95FrameMs}ms  slow(>32ms)=${r.slowFrames}`);
  console.log(`  motion/anim els=${r.motionEls}  imgs=${r.images} (oversized=${r.bigImages})  videos=${r.videos}  fixed=${r.fixedElements}`);
  if (r.bigImagePaths.length) console.log(`  oversized: ${r.bigImagePaths.join(", ")}`);
  if (r.errors.length) console.log(`  errors:\n    - ${r.errors.join("\n    - ")}`);
}
