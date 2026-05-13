import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE || 'http://localhost:3030';
const OUT = process.env.OUT || '/tmp/sd-shots/before';
fs.mkdirSync(OUT, { recursive: true });

const PAGES = [
  ['home', '/'],
  ['for-doctors', '/for-doctors'],
  ['hospitals', '/hospitals'],
  ['partners', '/partners'],
  ['about', '/about'],
  ['contact', '/contact'],
];

const VIEWPORTS = [
  ['mobile', 375, 812],
  ['tablet', 768, 1024],
  ['laptop13', 1280, 800],
  ['laptop15', 1440, 900],
  ['desktop', 1920, 1080],
];

// Force framer-motion whileInView elements into final state so fullPage
// screenshots don't capture huge blocks of opacity:0 content.
const FORCE_VISIBLE_CSS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
  }
`;

const issues = [];

(async () => {
  const browser = await chromium.launch();
  for (const [vname, w, h] of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(`PAGEERR ${e.message}`));
    page.on('console', m => { if (m.type() === 'error' && !m.text().includes('Failed to fetch RSC')) errors.push(`CONSOLE ${m.text()}`); });

    for (const [pname, url] of PAGES) {
      try {
        await page.goto(BASE + url, { waitUntil: 'networkidle', timeout: 30000 });
      } catch (e) {
        await page.goto(BASE + url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      }
      await page.waitForTimeout(800);
      // Scroll through the whole page to trigger every IntersectionObserver
      // -based whileInView reveal, then return to top before screenshotting.
      await page.evaluate(async () => {
        const dist = 300;
        for (let y = 0; y < document.body.scrollHeight; y += dist) {
          window.scrollTo(0, y);
          await new Promise(r => setTimeout(r, 80));
        }
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise(r => setTimeout(r, 300));
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 300));
      });
      await page.addStyleTag({ content: FORCE_VISIBLE_CSS });
      await page.waitForTimeout(400);

      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        const scrollW = doc.scrollWidth;
        const clientW = doc.clientWidth;
        const offenders = [];
        if (scrollW > clientW + 2) {
          const all = document.body.querySelectorAll('*');
          for (const el of all) {
            const r = el.getBoundingClientRect();
            if (r.right > clientW + 2 || r.left < -2) {
              const cs = getComputedStyle(el);
              if (cs.position === 'fixed') continue;
              if (r.width === 0 || r.height === 0) continue;
              offenders.push({
                tag: el.tagName,
                cls: (el.className && el.className.toString ? el.className.toString() : '').slice(0, 80),
                id: el.id,
                left: Math.round(r.left),
                right: Math.round(r.right),
                width: Math.round(r.width),
              });
              if (offenders.length >= 12) break;
            }
          }
        }
        return { scrollW, clientW, offenders };
      });
      if (overflow.scrollW > overflow.clientW + 2) {
        issues.push({ page: pname, viewport: vname, ...overflow });
      }
      const file = path.join(OUT, `${pname}_${vname}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(`shot ${pname} ${vname} (${w}x${h}) -> scroll ${overflow.scrollW}/${overflow.clientW}${overflow.offenders.length ? ' OVERFLOW' : ''}`);
    }
    if (errors.length) issues.push({ viewport: vname, errors });
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'issues.json'), JSON.stringify(issues, null, 2));
  console.log('issues:', issues.length);
})();
