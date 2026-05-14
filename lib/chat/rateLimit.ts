const WINDOW_MS = 60_000;
// Realistic visitors send maybe 1 message every few seconds; 60/min still
// blocks scripted abuse but doesn't trip during heavy E2E test runs.
const MAX_REQUESTS = 60;

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true as const, remaining: MAX_REQUESTS - 1 };
  }

  if (bucket.count >= MAX_REQUESTS) {
    return {
      ok: false as const,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { ok: true as const, remaining: MAX_REQUESTS - bucket.count };
}
