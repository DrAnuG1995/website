const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

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
