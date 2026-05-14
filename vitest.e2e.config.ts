import { defineConfig } from "vitest/config";
import path from "node:path";

// Separate config for E2E tests: includes only tests/e2e and gives them a long
// per-test timeout because real LLM calls are slow.
export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "./") },
  },
  test: {
    environment: "node",
    include: ["tests/e2e/**/*.test.ts"],
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
