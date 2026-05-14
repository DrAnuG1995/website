export type Cta = "book" | "download" | null;
export type Persona = "doctor" | "hospital";
export type Lead = { persona: Persona; email: string; phone?: string };

// Tolerate small LLM spelling slips on the funnel tokens
// (e.g. [DOWLOAD_APP] instead of [DOWNLOAD_APP]). We anchor on the suffix
// `_DEMO]` / `_APP]` since it's short, distinctive, and won't collide with
// markdown links like `[label](url)`.
const BOOK_RE = /\[[A-Za-z_]*_DEMO\]/g;
const DOWNLOAD_RE = /\[[A-Za-z_]*_APP\]/g;
const LEAD_RE = /\[LEAD:([^\]]+)\]/g;

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

// Strips [LEAD:...] tokens from text and returns the parsed lead (if any).
// Format: [LEAD:persona=doctor;email=foo@bar.com;phone=+61400000000]
//         [LEAD:persona=hospital;email=admin@hospital.com]
export function extractLead(raw: string): { text: string; lead: Lead | null } {
  LEAD_RE.lastIndex = 0;
  const match = LEAD_RE.exec(raw);
  const text = raw.replace(/\[LEAD:[^\]]+\]/g, "").trim();
  if (!match) return { text, lead: null };

  const fields = new Map<string, string>();
  for (const pair of match[1].split(";")) {
    const idx = pair.indexOf("=");
    if (idx === -1) continue;
    const k = pair.slice(0, idx).trim().toLowerCase();
    const v = pair.slice(idx + 1).trim();
    if (k && v) fields.set(k, v);
  }

  const persona = fields.get("persona");
  const email = fields.get("email");
  if ((persona !== "doctor" && persona !== "hospital") || !email) {
    return { text, lead: null };
  }

  // Basic email shape check; the server validates again.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { text, lead: null };
  }

  const phone = fields.get("phone");
  return {
    text,
    lead: { persona, email, phone: phone && phone.length > 0 ? phone : undefined },
  };
}

// Strips ALL recognised tokens (CTA + LEAD). Useful when you only need
// display text and don't care about the structured signals.
export function stripAllTokens(raw: string): string {
  return raw
    .replace(BOOK_RE, "")
    .replace(DOWNLOAD_RE, "")
    .replace(/\[LEAD:[^\]]+\]/g, "")
    .trim();
}
