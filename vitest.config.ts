import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // E2E tests hit a real dev server + real OpenAI — opt in via npm run test:e2e
    exclude: ["node_modules", ".next", "tests/e2e/**"],
    // Each test file gets a fresh module graph so module-level state
    // (e.g. the in-memory rate-limit map) doesn't bleed between files.
    isolate: true,
  },
});
