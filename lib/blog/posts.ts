/**
 * Shared types + client-safe helpers for blog posts.
 * Server-only file I/O lives in lib/blog/posts-server.ts.
 *
 * Schema is owned by the Python pipeline at backend/models.py:FinalPost
 * (STATDOCTOR_BLOGPOSTING repo). Keep field names in sync.
 */

export type AHPRAFlag = {
  flag_type: string;
  excerpt: string;
  fix_applied: string;
  requires_human_review: boolean;
};

export type Source = {
  title: string;
  url: string;
  publisher: string;
  snippet: string;
};

export type TwitterCard = {
  title: string;
  description: string;
  image: string;
};

export type ContentType = "news" | "guide" | "company";

export type Post = {
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  og_image_alt: string;
  content_markdown: string;
  tldr: string;
  pillar: string;
  content_type: ContentType;
  target_keywords: string[];
  keywords?: string[];
  twitter_card?: TwitterCard;
  word_count: number;
  reading_time_minutes: number;
  sources: Source[];
  image_url: string | null;
  image_credit: string | null;
  faq_json_ld: Record<string, unknown>;
  medical_webpage_schema: Record<string, unknown>;
  ahpra_flags: AHPRAFlag[];
  ahpra_passed: boolean;
  generated_at: string;
};

export const PILLAR_LABELS: Record<string, string> = {
  locum_pay_rates: "Locum Pay & Rates",
  how_to_locum: "Getting Started",
  locum_by_location: "Locum by Location",
  industry_news: "Industry News",
  locum_vs_agency: "Marketplace vs Agency",
  doctor_wellbeing: "Doctor Wellbeing",
  company_pov: "Inside StatDoctor",
};

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  news: "News",
  guide: "Guides",
  company: "Inside StatDoctor",
};

// Tailwind colour token per content_type — matches the brand palette.
// Used for ribbon, chip, and accent on cards + article hero.
export const CONTENT_TYPE_ACCENT: Record<
  ContentType,
  { bg: string; text: string; ribbon: string; ring: string }
> = {
  news: { bg: "bg-ocean", text: "text-white", ribbon: "bg-ocean", ring: "border-ocean/40" },
  guide: { bg: "bg-electric", text: "text-ink", ribbon: "bg-electric", ring: "border-electric/50" },
  company: { bg: "bg-ocean-soft", text: "text-ink", ribbon: "bg-ocean-soft", ring: "border-ocean-soft/50" },
};

// Mirror of backend CONTENT_TYPE_PILLARS — used by the filter UI to scope
// pillar chips when a content_type is selected.
export const CONTENT_TYPE_PILLAR_MAP: Record<ContentType, string[]> = {
  news: ["industry_news"],
  guide: [
    "locum_pay_rates",
    "how_to_locum",
    "locum_by_location",
    "doctor_wellbeing",
    "locum_vs_agency",
  ],
  company: ["company_pov", "locum_vs_agency"],
};

export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
