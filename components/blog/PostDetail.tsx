import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React from "react";
import type { Components } from "react-markdown";
import { PILLAR_LABELS, CONTENT_TYPE_LABELS, type Post } from "@/lib/blog/posts";
import TocSidebar, { type TocItem } from "./TocSidebar";
import FaqAccordion, { type FaqItem } from "./FaqAccordion";
import ReadingProgress from "./ReadingProgress";
import DisclaimerBanner from "./DisclaimerBanner";
import WhoThisIsFor from "./WhoThisIsFor";
import AuthorBio from "./AuthorBio";
import RelatedArticles from "./RelatedArticles";
import SocialShare from "./SocialShare";
import SourceImageGallery, {
  type SourceWithImage,
} from "./SourceImageGallery";
import JoinCta from "./JoinCta";
import MobileToc from "./MobileToc";

function slugify(text: string): string {
  return text
    .replace(/[*_`[\]()#]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function extractNodeText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractNodeText).join("");
  if (React.isValidElement(node)) {
    return extractNodeText(
      (node.props as { children?: React.ReactNode }).children,
    );
  }
  return "";
}

function stripMarker(
  children: React.ReactNode,
  pattern: RegExp,
): React.ReactNode {
  return (
    React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;
      const childEl = child as React.ReactElement<{
        children?: React.ReactNode;
      }>;
      const fullText = extractNodeText(childEl.props?.children ?? null).trim();
      if (
        pattern.test(fullText) &&
        fullText.replace(pattern, "").trim() === ""
      ) {
        return null;
      }
      if (childEl.type === "p" && pattern.test(fullText)) {
        const newPChildren = React.Children.map(
          childEl.props?.children,
          (pChild) => {
            if (typeof pChild === "string") {
              return pChild.replace(pattern, "").replace(/^\s*/, "");
            }
            return pChild;
          },
        );
        return React.cloneElement(childEl, {}, newPChildren);
      }
      return child;
    })?.filter(Boolean) ?? []
  );
}

function extractUrl(text: string): string | null {
  const match = text.match(/https?:\/\/[^\s)>\]"']+/);
  return match ? match[0] : null;
}

function preprocessCalloutMarkers(md: string): string {
  return md.replace(
    /^(> ?)\[(KEY TAKEAWAY|INFO|TIP|AU|NZ|INTERESTING FACT|INSIGHT|DONT WORRY|REASSURANCE|POV|CASE STUDY:[^\]]+)\] +(.+)$/gm,
    (_match, prefix, type, content) =>
      `${prefix}[${type}]\n${prefix}\n${prefix}${content}`,
  );
}

function splitByH2(md: string): string[] {
  return md.split(/(?=^## )/m).filter((s) => s.trim());
}

function extractH2s(md: string): TocItem[] {
  return md
    .split("\n")
    .filter((l) => l.startsWith("## "))
    .map((l) => {
      const raw = l.replace(/^## /, "").trim();
      if (raw.toLowerCase() === "sources") return null;
      const text = raw.toLowerCase().includes("frequently asked")
        ? "FAQ"
        : raw;
      return { id: slugify(raw), text };
    })
    .filter(Boolean) as TocItem[];
}

function extractFaq(md: string): FaqItem[] {
  const heading = "## Frequently Asked Questions";
  const start = md.indexOf(heading);
  if (start === -1) return [];

  let section = md.slice(start + heading.length);
  const nextH2 = section.search(/\n## /);
  if (nextH2 > -1) section = section.slice(0, nextH2);

  const pairs: FaqItem[] = [];
  const re = /\*\*Q:\s*([^*]+?)\*\*\s*\n+A:\s*([\s\S]*?)(?=\n\*\*Q:|$)/g;
  let m;
  while ((m = re.exec(section)) !== null) {
    const q = m[1].trim();
    const a = m[2].trim();
    if (q && a) pairs.push({ q, a });
  }
  return pairs;
}

function splitAtFaq(md: string): { before: string; sources: string } {
  const faqIdx = md.indexOf("\n## Frequently Asked Questions");
  const srcIdx = md.indexOf("\n## Sources");
  if (faqIdx === -1) {
    return { before: md, sources: srcIdx > -1 ? md.slice(srcIdx) : "" };
  }
  return {
    before: md.slice(0, faqIdx),
    sources: srcIdx > -1 ? md.slice(srcIdx) : "",
  };
}

export default function PostDetail({
  post,
  relatedPosts = [],
  sourceImages = [],
}: {
  post: Post;
  relatedPosts?: Post[];
  sourceImages?: SourceWithImage[];
}) {
  const pillarLabel = PILLAR_LABELS[post.pillar] ?? post.pillar;
  const generated = new Date(post.generated_at).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const processed = preprocessCalloutMarkers(post.content_markdown);
  const tocItems = extractH2s(processed);
  const faqItems = extractFaq(processed);
  const { before, sources } = splitAtFaq(processed);
  const contentSections = splitByH2(before);

  // Hero image — three-tier fallback so every article has a visual lead.
  //   1. Cited source's OG photograph (best — Guardian/news with caption)
  //   2. The Researcher's curated Unsplash hero, credited via image_credit
  //   3. Editorial typography hero (no image at all)
  const isPhotoUrl = (u: string) =>
    !/(logo|favicon|brand-image|sprite|gravatar|emoji|social-share|og-default)/i.test(
      u,
    );
  const sourcePhoto =
    sourceImages.find((s) => s.imageUrl && isPhotoUrl(s.imageUrl)) ?? null;

  const unsplashHero =
    !sourcePhoto && post.image_url && post.image_url.includes("unsplash.com")
      ? {
          url: post.image_url,
          credit: post.image_credit ?? "Photo via Unsplash",
        }
      : null;

  const mdComponents: Components = {
    h2: ({ children }) => {
      const text = extractNodeText(children);
      const id = slugify(text);
      return <h2 id={id}>{children}</h2>;
    },

    blockquote: ({ children }) => {
      const text = extractNodeText(children);

      if (text.includes("[GRID]")) {
        const items = extractNodeText(children)
          .replace("[GRID]", "")
          .split(/\n[-*]\s+/)
          .map((s) => s.trim())
          .filter(Boolean);
        return (
          <div className="feature-card-grid">
            {items.map((item, i) => {
              const [title, ...rest] = item.split(/[:—–]/);
              return (
                <div key={i} className="feature-card">
                  <p className="feature-card-title">{title?.trim()}</p>
                  {rest.length > 0 && (
                    <p className="feature-card-desc">
                      {rest.join(":").trim()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        );
      }

      if (text.includes("[KEY FACTS]")) {
        const filtered = stripMarker(children, /\[KEY FACTS\]/i);
        return (
          <div className="callout-key-facts">
            <div className="callout-header-band">
              <div className="callout-header-band-left">
                <span>📌</span>
                <span>Key Facts</span>
              </div>
            </div>
            <div className="callout-content">
              {filtered}
              <p className="callout-sources-note">
                Sources:{" "}
                <a href="#sources">{post.sources.length} cited below ↓</a>
              </p>
            </div>
          </div>
        );
      }

      if (text.includes("[KEY TAKEAWAY]")) {
        const filtered = stripMarker(children, /\[KEY TAKEAWAY\]\s*/i);
        return (
          <div className="callout-takeaway">
            <div className="callout-header-band">
              <div className="callout-header-band-left">
                <span>✓</span>
                <span>Key Takeaway</span>
              </div>
            </div>
            <div className="callout-content">{filtered}</div>
          </div>
        );
      }

      if (text.match(/\[INFO\]|\[TIP\]/i)) {
        const filtered = stripMarker(children, /\[(INFO|TIP)\]\s*/i);
        return (
          <div className="callout-info">
            <div className="callout-header-band">
              <div className="callout-header-band-left">
                <span>ℹ</span>
                <span>Info</span>
              </div>
            </div>
            <div className="callout-content">{filtered}</div>
          </div>
        );
      }

      if (text.match(/\[CASE STUDY/i)) {
        const title =
          text.match(/\[CASE STUDY:\s*([^\]]+)\]/i)?.[1] ?? "Case Study";
        const filtered = stripMarker(children, /\[CASE STUDY:[^\]]+\]\s*/i);
        const url = extractUrl(text);

        if (!url) {
          return (
            <div className="callout-insight">
              <div className="callout-header-band">
                <div className="callout-header-band-left">
                  <span>🔍</span>
                  <span>Key Insight</span>
                </div>
              </div>
              <div className="callout-content">{filtered}</div>
            </div>
          );
        }

        return (
          <div className="callout-case-study">
            <div className="callout-header-band">
              <div className="callout-header-band-left">
                <span>📋</span>
                <span>{title}</span>
              </div>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="callout-header-band-link text-white"
              >
                Read case study →
              </a>
            </div>
            <div className="callout-content">{filtered}</div>
          </div>
        );
      }

      if (text.match(/\[AU\]/i)) {
        const filtered = stripMarker(children, /\[AU\]\s*/i);
        return (
          <div className="callout-au">
            <div className="callout-header-band">
              <div className="callout-header-band-left">
                <span>🇦🇺</span>
                <span>Australian Context</span>
              </div>
            </div>
            <div className="callout-content">{filtered}</div>
          </div>
        );
      }

      if (text.match(/\[NZ\]/i)) {
        const filtered = stripMarker(children, /\[NZ\]\s*/i);
        return (
          <div className="callout-nz">
            <div className="callout-header-band">
              <div className="callout-header-band-left">
                <span>🇳🇿</span>
                <span>New Zealand Context</span>
              </div>
            </div>
            <div className="callout-content">{filtered}</div>
          </div>
        );
      }

      if (text.match(/\[STAT:/i)) {
        const match = text.match(/\[STAT:\s*([^\]]+)\]\s*([\s\S]*)/);
        const value = match?.[1]?.trim() ?? "";
        const rest = match?.[2]?.trim() ?? "";
        const parts = rest.split(/—|–|\|/).map((s) => s.trim());
        const mainLabel = parts[0] ?? "";
        const sourceText = parts[1] ?? "";
        const sourceUrl = extractUrl(sourceText) ?? extractUrl(rest);
        return (
          <div className="blog-stat-block">
            <p className="stat-value">{value}</p>
            {mainLabel && <p className="stat-label">{mainLabel}</p>}
            {sourceText && (
              <p className="stat-source">
                {sourceUrl ? (
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      textDecoration: "underline",
                    }}
                  >
                    Source:{" "}
                    {sourceText.replace(sourceUrl, "").trim() || sourceText}
                  </a>
                ) : (
                  <>Source: {sourceText}</>
                )}
              </p>
            )}
          </div>
        );
      }

      if (text.match(/\[INSIGHT:/i)) {
        const match = text.match(
          /\[INSIGHT:\s*([^\|]+)\|([^\|]+)\|([^\]]+)\]/,
        );
        const icon = match?.[1]?.trim() ?? "💡";
        const title = match?.[2]?.trim() ?? "";
        const desc = match?.[3]?.trim() ?? "";
        return (
          <div className="blog-insight-card">
            <span className="insight-icon">{icon}</span>
            <div>
              <p className="insight-title">{title}</p>
              <p className="insight-desc">{desc}</p>
            </div>
          </div>
        );
      }

      if (text.match(/\[INTERESTING FACT\]/i)) {
        const filtered = stripMarker(children, /\[INTERESTING FACT\]\s*/i);
        return (
          <div className="callout-fact">
            <div className="callout-header-band">
              <div className="callout-header-band-left">
                <span>⚡</span>
                <span>Interesting Fact</span>
              </div>
            </div>
            <div className="callout-content">{filtered}</div>
          </div>
        );
      }

      if (text.match(/^\[INSIGHT\]/i)) {
        const filtered = stripMarker(children, /\[INSIGHT\]\s*/i);
        return (
          <div className="callout-insight">
            <div className="callout-header-band">
              <div className="callout-header-band-left">
                <span>🔍</span>
                <span>Insight</span>
              </div>
            </div>
            <div className="callout-content">{filtered}</div>
          </div>
        );
      }

      // [POV] — Inside StatDoctor founder-voice callout (company content_type)
      if (text.match(/^\[POV\]/i) || text.match(/\n\[POV\]/i)) {
        const filtered = stripMarker(children, /\[POV\]\s*/i);
        return (
          <div className="callout-pov">
            <div className="callout-header-band">
              <div className="callout-header-band-left">
                <span>◆</span>
                <span>Inside StatDoctor</span>
              </div>
            </div>
            <div className="callout-content">{filtered}</div>
          </div>
        );
      }

      if (text.match(/\[DONT WORRY\]|\[REASSURANCE\]/i)) {
        const filtered = stripMarker(
          children,
          /\[(DONT WORRY|REASSURANCE)\]\s*/i,
        );
        return (
          <div className="callout-reassure">
            <div className="callout-header-band">
              <div className="callout-header-band-left">
                <span>🙌</span>
                <span>Don&apos;t Worry</span>
              </div>
            </div>
            <div className="callout-content">{filtered}</div>
          </div>
        );
      }

      return <blockquote className="post-blockquote">{children}</blockquote>;
    },

    ol: ({ children }) => <ol className="post-numbered-list">{children}</ol>,

    ul: ({ children }) => {
      const items = React.Children.toArray(children);
      const boldCount = items.filter((child) => {
        if (!React.isValidElement(child)) return false;
        const liChildren = React.Children.toArray(
          ((child as React.ReactElement).props as {
            children?: React.ReactNode;
          }).children,
        );
        const firstChild = liChildren[0];
        if (
          !React.isValidElement(firstChild) ||
          (firstChild as React.ReactElement).type !== "p"
        )
          return false;
        const pChildren = React.Children.toArray(
          ((firstChild as React.ReactElement).props as {
            children?: React.ReactNode;
          }).children,
        );
        return (
          React.isValidElement(pChildren[0]) &&
          (pChildren[0] as React.ReactElement).type === "strong"
        );
      }).length;

      if (boldCount >= 2) {
        return <ul className="post-checklist not-prose">{children}</ul>;
      }
      return <ul className="post-bullets">{children}</ul>;
    },

    li: ({ children }) => {
      const childArray = React.Children.toArray(children);
      const firstChild = childArray[0];

      if (
        React.isValidElement(firstChild) &&
        (firstChild as React.ReactElement).type === "p"
      ) {
        const pChildren = React.Children.toArray(
          ((firstChild as React.ReactElement).props as {
            children?: React.ReactNode;
          }).children,
        );
        const firstInP = pChildren[0];
        if (
          React.isValidElement(firstInP) &&
          (firstInP as React.ReactElement).type === "strong"
        ) {
          const title = extractNodeText(firstInP);
          const desc = pChildren
            .slice(1)
            .map((c) => extractNodeText(c as React.ReactNode))
            .join("")
            .replace(/^[：:—–\s]+/, "")
            .trim();
          return (
            <li className="post-checklist-item">
              <div className="post-checklist-circle">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 7L5.5 10L11.5 4"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="post-checklist-title">{title}</p>
                {desc && <p className="post-checklist-desc">{desc}</p>}
              </div>
            </li>
          );
        }
      }
      return <li>{children}</li>;
    },

    p: ({ children }) => {
      const text = extractNodeText(children);
      if (
        text.toLowerCase().includes("statdoctor") &&
        (text.toLowerCase().includes("fastest-growing") ||
          text.toLowerCase().includes("join") ||
          text.toLowerCase().includes("network") ||
          text.toLowerCase().includes("register"))
      ) {
        return (
          <div className="post-cta-section">
            <h3>Join Australia&apos;s Fastest-Growing Locum Network</h3>
            <p>
              StatDoctor connects hospitals and clinics with verified locum
              doctors across Australia. Streamlined onboarding, instant
              bookings, and transparent rates — no middlemen.
            </p>
            <div>
              <a href="https://statdoctor.app" className="post-cta-btn">
                I&apos;m a Doctor — Find Shifts
              </a>
              <a
                href="https://statdoctor.app"
                className="post-cta-btn post-cta-btn-outline"
              >
                Post a Locum Role
              </a>
            </div>
            <p className="post-cta-tagline">
              Free to sign up · No agency fees · Instant matching
            </p>
          </div>
        );
      }
      return <p>{children}</p>;
    },

    img: ({ src, alt }) => {
      if (!src || typeof src !== "string") return null;
      if (src.includes("placeholder")) return null;

      // QuickChart images are charts generated from the article's statistics.
      // Render in a dedicated styled figure (caption + "Chart: StatDoctor" credit).
      if (src.includes("quickchart.io")) {
        return (
          <figure className="post-chart-figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt ?? "Statistics chart"} loading="lazy" />
            <figcaption>
              <span className="chart-caption-text">{alt ?? "Statistics chart"}</span>
              <span className="chart-caption-credit">Chart by StatDoctor · sourced from cited references</span>
            </figcaption>
          </figure>
        );
      }

      // Inline Unsplash images carry no per-image credit in markdown, so we
      // skip them. The hero already carries a global Unsplash credit.
      if (src.includes("unsplash.com")) return null;

      return (
        <figure className="post-inline-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt ?? ""} loading="lazy" />
          {alt && <figcaption>{alt}</figcaption>}
        </figure>
      );
    },
  };

  return (
    <>
      <ReadingProgress />

      {/* Top spacer + disclaimer — clears the floating nav (~80px) */}
      <div className="pt-24 md:pt-28 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <DisclaimerBanner />
        </div>
      </div>

      <section className="relative z-10 min-h-[calc(100vh-80px)] px-4 sm:px-6 pt-8 pb-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/blog"
            className="post-back-link inline-flex items-center gap-1.5 text-sm font-medium mb-6 transition-colors duration-200"
            data-hover
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to posts
          </Link>

          {/* Content-type eyebrow line — colour-coded chip + pillar label */}
          {(() => {
            const ct = post.content_type ?? "news";
            const ctLabel = CONTENT_TYPE_LABELS[ct] ?? "News";
            const ctChipBg =
              ct === "news"
                ? "bg-ocean text-white"
                : ct === "guide"
                  ? "bg-electric text-ink"
                  : "bg-ocean-soft text-ink";
            return (
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full mono text-[10px] tracking-[0.18em] uppercase ${ctChipBg}`}>
                  {ct === "news" && (
                    <span className="block w-1.5 h-1.5 rounded-full bg-electric animate-pulse" />
                  )}
                  {ctLabel}
                </span>
                <span className="eyebrow text-muted">{pillarLabel}</span>
              </div>
            );
          })()}

          {/* Hero banner — flat ink, ocean ring, electric pill (matches homepage card pattern) */}
          <div className="relative mb-6">
            <div
              aria-hidden
              className="absolute -inset-3 md:-inset-4 rounded-[28px] -z-10"
              style={{
                background:
                  "linear-gradient(135deg, rgba(50,50,255,0.25), rgba(205,227,93,0.35))",
                filter: "blur(24px)",
                opacity: 0.5,
              }}
            />
            <div className="relative rounded-[24px] md:rounded-[28px] p-6 md:p-10 bg-ink text-white border-2 border-ocean/40 shadow-[0_40px_120px_-30px_rgba(50,50,255,0.45)]">
              <span className="inline-block mono text-[10px] font-semibold tracking-[0.18em] uppercase px-2.5 py-1 rounded-md mb-4 bg-electric text-ink">
                {pillarLabel} · {post.reading_time_minutes} min read
              </span>

              <h1 className="display text-3xl md:text-5xl lg:text-6xl text-white mb-4 leading-[1.02] max-w-3xl">
                {post.title}
              </h1>

              <p className="text-sm md:text-base text-white/80 font-light mb-6 max-w-2xl leading-relaxed">
                {post.meta_description}
              </p>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full grid place-items-center text-[10px] font-semibold text-white flex-shrink-0 bg-ocean">
                  AG
                </div>
                <div>
                  <p className="text-xs font-medium text-white leading-tight">
                    Dr. Anu Ganugapati
                  </p>
                  <p className="eyebrow text-white/60 mt-0.5">
                    Published {generated}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Per-content-type disclaimer / freshness line */}
          {(() => {
            const ct = post.content_type ?? "news";
            if (ct === "news") {
              return (
                <div className="mb-6 px-4 py-3 rounded-xl bg-ocean/5 border border-ocean/15 text-xs text-ink/70">
                  <strong className="text-ink">Published {generated} — news cycle.</strong>{" "}
                  Confirm latest figures on AHPRA, Services Australia, or the cited primary source before acting.
                </div>
              );
            }
            if (ct === "guide") {
              return (
                <div className="mb-6 px-4 py-3 rounded-xl bg-electric/15 border border-electric/30 text-xs text-ink/70">
                  <strong className="text-ink">Last reviewed: {generated}.</strong>{" "}
                  Pay rates, AHPRA fees, and tax thresholds change — verify time-sensitive figures before relying on them.
                </div>
              );
            }
            return null;
          })()}

          {sourcePhoto?.imageUrl ? (
            <figure className="article-hero-img-wrap mb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sourcePhoto.imageUrl}
                alt={sourcePhoto.title}
                className="article-hero-img"
                loading="eager"
              />
              <figcaption className="article-hero-img-caption">
                <span className="hero-credit-label">Source</span>
                <a
                  href={sourcePhoto.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-credit-publisher"
                >
                  {sourcePhoto.publisher}
                </a>
                <span className="hero-credit-sep">·</span>
                <a
                  href={sourcePhoto.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-credit-title"
                >
                  {sourcePhoto.title}
                </a>
              </figcaption>
            </figure>
          ) : unsplashHero ? (
            <figure className="article-hero-img-wrap mb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={unsplashHero.url}
                alt={post.og_image_alt ?? post.title}
                className="article-hero-img"
                loading="eager"
              />
              <figcaption className="article-hero-img-caption">
                <span className="hero-credit-label">Image</span>
                <a
                  href="https://unsplash.com/?utm_source=statdoctor&utm_medium=referral"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-credit-publisher"
                >
                  Unsplash
                </a>
                <span className="hero-credit-sep">·</span>
                <span className="hero-credit-title">{unsplashHero.credit}</span>
              </figcaption>
            </figure>
          ) : (
            // Editorial typography hero — used when no source has a photograph
            // (gov-only citations, AHPRA/AIHW/etc.). Keeps every article visually
            // anchored even when scrape yields nothing.
            <figure className="article-hero-img-wrap article-hero-typo mb-8">
              <div className="article-hero-typo-inner">
                <p className="article-hero-typo-pillar">
                  {pillarLabel}
                </p>
                <p className="article-hero-typo-title">
                  {post.title}
                </p>
                <p className="article-hero-typo-attr">
                  {post.sources.length > 0 && (
                    <>Citing {post.sources.length} sources · {Array.from(new Set(post.sources.map(s => s.publisher))).slice(0, 3).join(" · ")}{post.sources.length > 3 ? " +" + (post.sources.length - 3) : ""}</>
                  )}
                </p>
              </div>
            </figure>
          )}

          <WhoThisIsFor />
          <MobileToc items={tocItems} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8">
            <div className="rounded-2xl p-5 sm:p-8 md:p-10 min-w-0 bg-white border border-ink/10 shadow-[0_4px_24px_-4px_rgba(26,26,46,0.06)]">
              {contentSections.map((section, i) => (
                <article key={i} className="post-prose">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={mdComponents}
                  >
                    {section}
                  </ReactMarkdown>
                </article>
              ))}

              {faqItems.length > 0 && (
                <div className="mt-10">
                  <h2
                    id="frequently-asked-questions"
                    className="display text-3xl md:text-4xl mb-5 text-ink"
                  >
                    Frequently Asked Questions
                  </h2>
                  <FaqAccordion items={faqItems} />
                </div>
              )}

              {sources && (
                <article
                  id="sources"
                  className="post-prose mt-10 pt-8 border-t border-ink/10"
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={mdComponents}
                  >
                    {sources}
                  </ReactMarkdown>
                </article>
              )}

              <SourceImageGallery sources={sourceImages} />
              <SocialShare title={post.title} />
            </div>

            <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
              <TocSidebar items={tocItems} />
            </aside>
          </div>

          <AuthorBio />
          <JoinCta />
          <RelatedArticles posts={relatedPosts} />

          <nav className="article-bottom-nav">
            <Link href="/blog">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to all posts
            </Link>
            <a href="#top">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 10l7-7 7 7M12 3v18"
                />
              </svg>
              Back to top
            </a>
          </nav>
        </div>
      </section>
    </>
  );
}
