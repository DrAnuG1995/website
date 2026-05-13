"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import SplitText from "@/components/SplitText";
import { useMemo, useState } from "react";
import {
  CONTENT_TYPE_LABELS,
  CONTENT_TYPE_PILLAR_MAP,
  type ContentType,
} from "@/lib/blog/posts";

export type BlogCard = {
  slug: string;
  title: string;
  tldr: string;
  pillar: string;
  pillar_label: string;
  content_type: ContentType;
  content_type_label: string;
  image_url: string | null;
  cover: { url: string; publisher: string; sourceUrl: string } | null;
  reading_time_minutes: number;
  generated_at: string;
};

const CONTENT_TYPE_ORDER: ContentType[] = ["news", "guide", "company"];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", {
    month: "short",
    year: "numeric",
  });
}

function formatCoverDate(iso: string): { month: string; year: string } {
  const d = new Date(iso);
  return {
    month: d.toLocaleDateString("en-AU", { month: "long" }),
    year: String(d.getFullYear()),
  };
}

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 14) return `${days} days ago`;
  if (days < 60) return `${Math.floor(days / 7)} weeks ago`;
  return formatDate(iso);
}

// Tailwind classes per content_type — one place, used for ribbon + chip.
const TYPE_RIBBON: Record<ContentType, string> = {
  news: "bg-ocean",
  guide: "bg-electric",
  company: "bg-ocean-soft",
};
const TYPE_CHIP: Record<ContentType, string> = {
  news: "bg-ocean text-white",
  guide: "bg-electric text-ink",
  company: "bg-ocean-soft text-ink",
};

export default function BlogClient({ posts }: { posts: BlogCard[] }) {
  // Content_types actually present in the data — keeps the chip row honest
  // (don't show "Inside StatDoctor" if no company posts exist).
  const availableTypes = useMemo(() => {
    const set = new Set<ContentType>();
    for (const p of posts) set.add(p.content_type);
    return CONTENT_TYPE_ORDER.filter((t) => set.has(t));
  }, [posts]);

  const [activeContentType, setActiveContentType] = useState<ContentType | "All">("All");
  const [activePillar, setActivePillar] = useState<string>("All");

  // Pillar chips re-scope to the active content_type's allowed pillar set.
  const visiblePillars = useMemo(() => {
    const allowed =
      activeContentType === "All"
        ? null
        : new Set(CONTENT_TYPE_PILLAR_MAP[activeContentType]);
    const set = new Map<string, string>();
    for (const p of posts) {
      if (allowed && !allowed.has(p.pillar)) continue;
      if (activeContentType !== "All" && p.content_type !== activeContentType) continue;
      set.set(p.pillar, p.pillar_label);
    }
    return Array.from(set.entries());
  }, [posts, activeContentType]);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (activeContentType !== "All" && p.content_type !== activeContentType) return false;
      if (activePillar !== "All" && p.pillar !== activePillar) return false;
      return true;
    });
  }, [posts, activeContentType, activePillar]);

  // When content_type changes, reset pillar so we don't end up with a
  // pillar selection that's invalid for the new content_type.
  const handleContentTypeChange = (t: ContentType | "All") => {
    setActiveContentType(t);
    setActivePillar("All");
  };

  return (
    <>
      <section className="pt-40 pb-12 px-6">
        <div className="max-w-[1280px] mx-auto">
          <div
            className="eyebrow mb-4"
            data-mascot="Stories from the locum frontline."
          >
            The Journal
          </div>
          <h1 className="display text-[clamp(34px,4.5vw,64px)] leading-[1.05]">
            <SplitText>Notes from</SplitText>{" "}
            <SplitText start={0.6} className="italic text-ocean">
              the front desk.
            </SplitText>
          </h1>
        </div>
      </section>

      {/* Content type filter — top row */}
      {availableTypes.length > 1 && (
        <section className="px-6">
          <div className="max-w-[1280px] mx-auto flex gap-2 flex-wrap pt-4">
            <button
              onClick={() => handleContentTypeChange("All")}
              className={`px-4 py-2 rounded-full mono text-[11px] tracking-widest transition-all duration-300 ${
                activeContentType === "All"
                  ? "bg-ink text-white"
                  : "bg-white border border-ink/15 text-ink hover:bg-ink hover:text-white"
              }`}
              data-hover
            >
              ALL
            </button>
            {availableTypes.map((t) => (
              <button
                key={t}
                onClick={() => handleContentTypeChange(t)}
                className={`px-4 py-2 rounded-full mono text-[11px] tracking-widest transition-all duration-300 ${
                  activeContentType === t
                    ? `${TYPE_CHIP[t]}`
                    : "bg-white border border-ink/15 text-ink hover:bg-ink hover:text-white"
                }`}
                data-hover
              >
                {CONTENT_TYPE_LABELS[t].toUpperCase()}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Pillar filter — bottom row, dynamically scoped */}
      {visiblePillars.length > 0 && (
        <section className="px-6 border-b border-ink/10">
          <div className="max-w-[1280px] mx-auto flex gap-2 flex-wrap py-4">
            <button
              onClick={() => setActivePillar("All")}
              className={`px-3.5 py-1.5 rounded-full mono text-[10px] tracking-widest transition-all duration-300 ${
                activePillar === "All"
                  ? "bg-ocean text-white"
                  : "bg-lavender text-ink hover:bg-ocean hover:text-white"
              }`}
              data-hover
            >
              ALL PILLARS
            </button>
            {visiblePillars.map(([slug, label]) => (
              <button
                key={slug}
                onClick={() => setActivePillar(slug)}
                className={`px-3.5 py-1.5 rounded-full mono text-[10px] tracking-widest transition-all duration-300 ${
                  activePillar === slug
                    ? "bg-ocean text-white"
                    : "bg-lavender text-ink hover:bg-ocean hover:text-white"
                }`}
                data-hover
              >
                {label.toUpperCase()}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="py-16 px-6">
        <div className="max-w-[1280px] mx-auto">
          {filtered.length === 0 ? (
            <div className="py-32 text-center">
              <p className="display text-3xl text-muted italic">
                Nothing here yet. Try a different filter.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((p, i) => {
                const cover = formatCoverDate(p.generated_at);
                const isCompany = p.content_type === "company";
                return (
                  <motion.div
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "150px" }}
                    transition={{ duration: 0.6, delay: (i % 6) * 0.08 }}
                    whileHover={{ y: -6 }}
                  >
                    <Link
                      href={`/blog/${p.slug}`}
                      className={`group block rounded-3xl overflow-hidden bg-white border border-ink/10 hover:border-ink transition-colors h-full ${
                        isCompany ? "border-l-4 border-l-ocean-soft" : ""
                      }`}
                      data-hover
                    >
                      <div className="aspect-[16/10] relative overflow-hidden bg-ink">
                        {/* Top-edge ribbon — colour signals content_type at a glance */}
                        <div
                          aria-hidden
                          className={`absolute top-0 inset-x-0 h-1 ${TYPE_RIBBON[p.content_type]}`}
                        />

                        {p.cover ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p.cover.url}
                              alt={`Source image, ${p.cover.publisher}`}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              loading="lazy"
                            />
                            <div
                              aria-hidden
                              className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent"
                            />
                            <p className="absolute bottom-3 left-4 right-4 text-[10px] tracking-[0.18em] uppercase text-white/90 font-medium">
                              Source: {p.cover.publisher}
                            </p>
                          </>
                        ) : (
                          <>
                            <div
                              aria-hidden
                              className="absolute inset-0"
                              style={{
                                background:
                                  "radial-gradient(circle at 22% 28%, rgba(50,50,255,0.55), transparent 55%), radial-gradient(circle at 82% 75%, rgba(205,227,93,0.28), transparent 60%)",
                              }}
                            />
                            <div className="absolute inset-0 flex items-end p-6">
                              <div>
                                <p className="display italic text-electric text-3xl leading-none mb-1">
                                  {cover.month}
                                </p>
                                <p className="mono text-[10px] tracking-[0.32em] text-white/70 uppercase">
                                  {cover.year} · Issue {String(i + 1).padStart(2, "0")}
                                </p>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Content-type chip top-left, pillar chip top-right */}
                        <span
                          className={`absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 mono text-[10px] tracking-widest rounded-full ${TYPE_CHIP[p.content_type]}`}
                        >
                          {p.content_type === "news" && (
                            <span className="block w-1.5 h-1.5 rounded-full bg-electric animate-pulse" />
                          )}
                          {p.content_type_label.toUpperCase()}
                        </span>
                        <span className="absolute top-4 right-4 px-2.5 py-1 bg-white/90 text-ink mono text-[9px] tracking-widest rounded-full">
                          {p.pillar_label.toUpperCase()}
                        </span>
                      </div>

                      <div className="p-6">
                        <h3 className="display text-2xl leading-tight group-hover:text-ocean transition-colors">
                          {p.title}
                        </h3>
                        {p.tldr && (
                          <p className="mt-3 text-sm text-muted leading-relaxed line-clamp-3">
                            {p.tldr}
                          </p>
                        )}
                        <div className="mt-4 mono text-[11px] tracking-widest text-muted flex justify-between">
                          <span>
                            {p.content_type === "news"
                              ? relativeDate(p.generated_at).toUpperCase()
                              : formatDate(p.generated_at).toUpperCase()}
                          </span>
                          <span>{p.reading_time_minutes} MIN</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
