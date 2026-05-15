import { chromium } from "playwright";

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
await page.goto("http://localhost:3000/about", { waitUntil: "networkidle" });

await page.evaluate(() => {
  const h = [...document.querySelectorAll("h2")].find((el) =>
    /team of three/i.test(el.textContent || "")
  );
  h?.scrollIntoView({ block: "start" });
});
await page.waitForTimeout(600);

const data = await page.evaluate(() => {
  const cards = [...document.querySelectorAll("article")].filter((a) =>
    /Seif Othman|Prahlad Payda/.test(a.textContent || "")
  );
  return cards.map((c) => {
    const name = c.querySelector("h3")?.textContent?.trim() || "";
    const img = c.querySelector("img");
    const imgBox = img ? img.getBoundingClientRect() : null;
    const imgWrap = img?.parentElement?.getBoundingClientRect() ?? null;
    const cardBox = c.getBoundingClientRect();
    const natural = img
      ? { w: img.naturalWidth, h: img.naturalHeight }
      : null;
    return {
      name,
      cardH: Math.round(cardBox.height),
      imgWrap: imgWrap
        ? { w: Math.round(imgWrap.width), h: Math.round(imgWrap.height) }
        : null,
      imgRendered: imgBox
        ? { w: Math.round(imgBox.width), h: Math.round(imgBox.height) }
        : null,
      natural,
      // ratio of rendered area to natural area — closer to 1 = less zoom
      coverScale: imgBox && natural
        ? +(Math.max(imgBox.width / natural.w, imgBox.height / natural.h)).toFixed(2)
        : null,
    };
  });
});

console.log(JSON.stringify(data, null, 2));

await page.screenshot({
  path: "scripts/screens/team-after.png",
  fullPage: false,
  clip: { x: 0, y: 0, width: 1280, height: 900 },
});

await browser.close();
