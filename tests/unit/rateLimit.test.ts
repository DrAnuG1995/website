import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { rateLimit } from "@/lib/chat/rateLimit";

const MAX = 60;
const WINDOW_MS = 60_000;

// Each test uses a unique IP key so module-level bucket state doesn't bleed.
let counter = 0;
const newKey = () => `test-ip-${Date.now()}-${counter++}`;

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("first request from a new key is allowed and reports MAX-1 remaining", () => {
    const r = rateLimit(newKey());
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.remaining).toBe(MAX - 1);
  });

  it("allows exactly MAX requests in a window then rejects the next one", () => {
    const key = newKey();
    for (let i = 0; i < MAX; i++) {
      const r = rateLimit(key);
      expect(r.ok).toBe(true);
    }
    const blocked = rateLimit(key);
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) {
      expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
      expect(blocked.retryAfterSeconds).toBeLessThanOrEqual(60);
    }
  });

  it("resets the bucket after the window expires", () => {
    const key = newKey();
    // Burn through the budget.
    for (let i = 0; i < MAX; i++) rateLimit(key);
    expect(rateLimit(key).ok).toBe(false);

    // Advance past the window.
    vi.advanceTimersByTime(WINDOW_MS + 1);

    const fresh = rateLimit(key);
    expect(fresh.ok).toBe(true);
    if (fresh.ok) expect(fresh.remaining).toBe(MAX - 1);
  });

  it("tracks separate buckets for different keys", () => {
    const a = newKey();
    const b = newKey();
    for (let i = 0; i < MAX; i++) rateLimit(a);
    expect(rateLimit(a).ok).toBe(false);
    // Key b has been untouched.
    expect(rateLimit(b).ok).toBe(true);
  });

  it("retryAfter shrinks as time passes within the same blocked window", () => {
    const key = newKey();
    for (let i = 0; i < MAX; i++) rateLimit(key);
    const first = rateLimit(key);
    expect(first.ok).toBe(false);
    const initialRetry = !first.ok ? first.retryAfterSeconds : 0;

    vi.advanceTimersByTime(30_000);
    const second = rateLimit(key);
    expect(second.ok).toBe(false);
    if (!second.ok) {
      expect(second.retryAfterSeconds).toBeLessThan(initialRetry);
    }
  });

  it("the remaining counter decrements monotonically across requests", () => {
    const key = newKey();
    let prev = MAX;
    for (let i = 0; i < MAX; i++) {
      const r = rateLimit(key);
      expect(r.ok).toBe(true);
      if (r.ok) {
        expect(r.remaining).toBeLessThan(prev);
        prev = r.remaining;
      }
    }
  });
});
