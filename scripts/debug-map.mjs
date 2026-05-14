import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
const consoleMessages = [];

page.on("pageerror", (err) => {
  errors.push({ message: err.message, stack: err.stack });
});
page.on("console", (msg) => {
  consoleMessages.push({ type: msg.type(), text: msg.text() });
});

await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 30000 }).catch((e) => {
  console.log("nav error:", e.message);
});
await page.waitForTimeout(3000);

console.log("=== PAGE ERRORS ===");
for (const e of errors) console.log(JSON.stringify(e, null, 2));
console.log("\n=== CONSOLE (errors/warnings only) ===");
for (const m of consoleMessages) {
  if (m.type === "error" || m.type === "warning") console.log(`[${m.type}] ${m.text}`);
}

await browser.close();
