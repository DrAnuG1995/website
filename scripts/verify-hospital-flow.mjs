import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded", timeout: 30000 });
await page.waitForTimeout(1500);

// Open chat
await page.click('button[aria-label="Open StatDoctor chat"]');
await page.waitForTimeout(800);

// Click suggested prompt for hospital
await page.click('text="I\'m with a hospital or clinic"');

// Wait for stream to finish (no more changes for 2s)
let last = "";
for (let i = 0; i < 30; i++) {
  await page.waitForTimeout(500);
  const t = await page.evaluate(() => document.body.innerText);
  if (t === last && i > 4) break;
  last = t;
}

// Extract assistant message after the user message
const bubbles = await page.evaluate(() => {
  // Assistant bubbles have bg-lavender; user have bg-ocean
  const all = Array.from(document.querySelectorAll(".bg-lavender, .bg-ocean"));
  return all.map((el) => ({
    role: el.classList.contains("bg-ocean") ? "user" : "assistant",
    text: el.innerText.trim(),
  }));
});

console.log("=== Conversation after persona reveal ===");
for (const b of bubbles) console.log(`[${b.role}]`, b.text.slice(0, 250));

// Specifically check the LAST assistant message
const lastAssistant = bubbles.filter((b) => b.role === "assistant").pop();
console.log("\n=== Last assistant reply ===\n" + lastAssistant.text);

// Was a "Book a call" button rendered?
const hasBookButton = await page.evaluate(() =>
  Array.from(document.querySelectorAll("a, button")).some((el) =>
    /book a call/i.test(el.textContent || "")
  )
);
console.log("\nBook-a-call button shown:", hasBookButton);
console.log("Expected: false (persona reveal alone shouldn't trigger BOOK_DEMO)");

await page.screenshot({ path: "/tmp/hospital-flow-step1.png", fullPage: false });

// Now ask a substantive question and see if the CTA appears
await page.fill('textarea[placeholder*="pricing"]', "How does pricing work for hospitals?");
await page.keyboard.press("Enter");

// Wait for response stream
last = "";
for (let i = 0; i < 60; i++) {
  await page.waitForTimeout(500);
  const t = await page.evaluate(() => document.body.innerText);
  if (t === last && i > 8) break;
  last = t;
}

const finalBubbles = await page.evaluate(() => {
  const all = Array.from(document.querySelectorAll(".bg-lavender, .bg-ocean"));
  return all.map((el) => ({
    role: el.classList.contains("bg-ocean") ? "user" : "assistant",
    text: el.innerText.trim(),
  }));
});
const finalAssistant = finalBubbles.filter((b) => b.role === "assistant").pop();
console.log("\n=== After substantive question ===\n" + finalAssistant.text);

const ceoMentioned = /\bceo\b/i.test(finalAssistant.text);
const hasBookButton2 = await page.evaluate(() =>
  Array.from(document.querySelectorAll("a, button")).some((el) =>
    /book a call/i.test(el.textContent || "")
  )
);
console.log("\nCEO mentioned in reply:", ceoMentioned);
console.log("Book-a-call button now shown:", hasBookButton2);
console.log("Expected: both true");

await page.screenshot({ path: "/tmp/hospital-flow-step2.png", fullPage: false });

await ctx.close();
await browser.close();
