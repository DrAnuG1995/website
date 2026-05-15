import { chromium } from "playwright";

const URL = process.env.URL || "http://localhost:3000/about";
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

await page.goto(URL, { waitUntil: "networkidle" });

// Scroll the team section into view so framer-motion mounts cards.
await page.evaluate(() => {
  const h = [...document.querySelectorAll("h2")].find((el) =>
    /team of three/i.test(el.textContent || "")
  );
  h?.scrollIntoView({ block: "center" });
});
await page.waitForTimeout(400);

const data = await page.evaluate(() => {
  const cards = [...document.querySelectorAll("article")].filter((a) =>
    /Seif Othman|Prahlad Payda/.test(a.textContent || "")
  );
  return cards.map((c) => {
    const name = c.querySelector("h3")?.textContent?.trim() || "";
    const paras = [...c.querySelectorAll("p")]
      .map((p) => p.textContent?.trim() || "")
      .filter((t) => t.length > 0);
    return { name, paraCount: paras.length, firstWords: paras.map((p) => p.slice(0, 60)) };
  });
});

console.log(JSON.stringify(data, null, 2));

const seif = data.find((d) => d.name === "Seif Othman");
const prahlad = data.find((d) => d.name === "Prahlad Payda");

const ok =
  !!seif &&
  !!prahlad &&
  seif.paraCount === 3 &&
  prahlad.paraCount === 2 &&
  seif.firstWords[0].startsWith("Seif leads the technology") &&
  prahlad.firstWords[0].startsWith("Prahlad brings a rare mix");

console.log(ok ? "PASS" : "FAIL");
await browser.close();
process.exit(ok ? 0 : 1);
