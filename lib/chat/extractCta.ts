export type Cta = "book" | "download" | null;

// Tolerate small LLM spelling slips on the funnel tokens
// (e.g. [DOWLOAD_APP] instead of [DOWNLOAD_APP]). We anchor on the suffix
// `_DEMO]` / `_APP]` since it's short, distinctive, and won't collide with
// markdown links like `[label](url)`.
const BOOK_RE = /\[[A-Za-z_]*_DEMO\]/g;
const DOWNLOAD_RE = /\[[A-Za-z_]*_APP\]/g;

export function extractCta(raw: string): { text: string; cta: Cta } {
  // Reset lastIndex defensively; both regexes are global.
  BOOK_RE.lastIndex = 0;
  DOWNLOAD_RE.lastIndex = 0;

  if (BOOK_RE.test(raw)) {
    return { text: raw.replace(BOOK_RE, "").trim(), cta: "book" };
  }
  if (DOWNLOAD_RE.test(raw)) {
    return { text: raw.replace(DOWNLOAD_RE, "").trim(), cta: "download" };
  }
  return { text: raw, cta: null };
}
