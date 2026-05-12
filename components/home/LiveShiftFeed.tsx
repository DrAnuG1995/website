"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { fetchLiveShifts, type LiveShift } from "@/lib/hospitals";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

type Accent = "ocean" | "electric" | "leaf" | "stat";
type Shift = {
  hospital: string;
  state: string;
  role: string;
  rate: string;
  accent: Accent;
};

const ACCENT_CYCLE: Accent[] = ["ocean", "leaf", "electric", "stat", "ocean"];

function shiftFromLive(ls: LiveShift, index: number): Shift {
  return {
    hospital: ls.hospital,
    state: ls.state,
    role: ls.role,
    rate: ls.rate,
    accent: ACCENT_CYCLE[index % ACCENT_CYCLE.length],
  };
}

const ACCENT_DOT: Record<Shift["accent"], string> = {
  ocean: "bg-ocean",
  electric: "bg-electric",
  leaf: "bg-leaf",
  stat: "bg-stat",
};

const ACCENT_TAG: Record<Shift["accent"], string> = {
  ocean: "bg-ocean/10 text-ocean",
  electric: "bg-electric/30 text-ink",
  leaf: "bg-leaf/12 text-leaf",
  stat: "bg-stat/12 text-stat",
};

type FeedItem = Shift & {
  id: string;
  postedAt: number;
  startsAt: string | null;
  variant: "upcoming" | "recent";
  logoUrl: string | null;
};

const VISIBLE = 5;

function toFeedItems(shifts: LiveShift[]): FeedItem[] {
  return shifts.slice(0, VISIBLE).map((s, i) => ({
    ...shiftFromLive(s, i),
    id: s.id,
    postedAt: new Date(s.postedAt).getTime(),
    startsAt: s.startsAt,
    variant: s.variant,
    logoUrl: s.logoUrl,
  }));
}

// Display string for the right-side timestamp column. Upcoming shifts show
// "Today" / "Tomorrow" / weekday + date; recent posts show the existing
// time-ago formatting.
function displayWhen(item: FeedItem, now: number): string {
  if (item.variant === "upcoming" && item.startsAt) {
    const start = new Date(item.startsAt + "T00:00:00");
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const days = Math.round((start.getTime() - today.getTime()) / 86_400_000);
    if (days <= 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days <= 6) return start.toLocaleDateString(undefined, { weekday: "short" });
    return start.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }
  return timeAgo(item.postedAt, now);
}

export default function LiveShiftFeed({ initialShifts }: { initialShifts: LiveShift[] }) {
  const [items, setItems] = useState<FeedItem[]>(() => toFeedItems(initialShifts));
  const [now, setNow] = useState(() => Date.now());
  const [lastRefreshAt, setLastRefreshAt] = useState(() => Date.now());
  // Cumulative count of shifts the user has seen since landing, including
  // any new ones pushed via realtime — drives the "X shifts since you
  // arrived" counter.
  const arrivedCountRef = useRef(items.length);

  // Live update path: Supabase realtime push (instant when the publication
  // is enabled) + 5-second polling fallback + tab-visibility refresh. Each
  // successful refetch stamps `lastRefreshAt` so the header can show an
  // "Updated Xs ago" ticker that proves the feed is alive.
  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const refetch = async () => {
      const picked = await fetchLiveShifts(VISIBLE);
      const fresh = toFeedItems(picked);
      // Count any IDs that weren't previously visible — those are "new"
      // posts since the user arrived.
      setItems((prev) => {
        const known = new Set(prev.map((p) => p.id));
        const added = fresh.filter((f) => !known.has(f.id)).length;
        arrivedCountRef.current += added;
        return fresh;
      });
      setLastRefreshAt(Date.now());
    };

    const channel = supabase
      .channel("live-shift-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "shifts" }, refetch)
      .subscribe();
    // Poll every 15 minutes — matches the CRM's admin-portal sync cadence,
    // so the public feed gets fresh data within a tick of the CRM itself.
    const interval = window.setInterval(refetch, 15 * 60 * 1000);
    const onVisibility = () => {
      if (document.visibilityState === "visible") refetch();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      supabase.removeChannel(channel);
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Tick clock every second so timestamps stay fresh.
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  if (items.length === 0) {
    // Hide the section entirely when there are no live shifts — better than
    // showing an empty feed widget on the marketing page.
    return null;
  }

  return (
    <section className="relative bg-white py-20 md:py-24 px-6 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(40% 40% at 80% 20%, rgba(50,50,255,0.10), transparent 70%), radial-gradient(40% 40% at 15% 85%, rgba(205,227,93,0.20), transparent 70%)",
        }}
      />

      <div className="relative max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-14"
        >
          <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">
            Right now on StatDoctor
          </div>
          <h2 className="display text-[clamp(28px,4.5vw,56px)] leading-[1.0]">
            Hospitals are posting shifts{" "}
            <span className="italic text-ocean">as you read this</span>.
          </h2>
          <p className="mt-4 text-muted max-w-xl mx-auto text-[14px] md:text-[15px] leading-relaxed">
            A live look at the marketplace. Every entry below is a real shift
            type that hospitals post on StatDoctor.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative max-w-[560px] mx-auto"
        >
          {/* Live header bar */}
          <div className="rounded-t-3xl bg-ink text-white px-5 md:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-stat opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-stat" />
              </span>
              <span className="text-[10px] tracking-[0.22em] uppercase font-semibold">
                Live · shifts feed
              </span>
            </div>
            <div className="text-[10px] tracking-[0.22em] uppercase text-bone/55 tabular-nums">
              {(() => {
                const sec = Math.max(0, Math.floor((now - lastRefreshAt) / 1000));
                if (sec < 5) return "Just updated";
                if (sec < 60) return `Updated ${sec}s ago`;
                const min = Math.floor(sec / 60);
                return `Updated ${min}m ago`;
              })()}
            </div>
          </div>

          {/* Feed body */}
          <div className="rounded-b-3xl bg-lavender border-x border-b border-ocean/10 shadow-[0_30px_70px_-20px_rgba(26,26,46,0.18)] overflow-hidden">
            <div className="divide-y divide-ocean/10">
              <AnimatePresence initial={false} mode="popLayout">
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: -28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{
                      layout: { type: "spring", stiffness: 240, damping: 30 },
                      opacity: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] },
                      y: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] },
                    }}
                    className="px-5 md:px-6 py-4 flex items-center gap-3 md:gap-4 bg-lavender min-h-[76px]"
                  >
                    {/* Hospital logo (falls back to initials if no logo) */}
                    <div
                      className={`relative shrink-0 w-10 h-10 rounded-full overflow-hidden grid place-items-center text-[12px] font-semibold ring-1 ring-ink/10 ${item.logoUrl ? "bg-white" : ACCENT_TAG[item.accent]}`}
                    >
                      {item.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.logoUrl}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            // If the logo fails to load, hide the img so the
                            // accent-coloured initials fall through underneath.
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        initials(item.hospital)
                      )}
                      {i === 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-stat ring-2 ring-lavender" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-[14px] font-semibold text-ink truncate flex-1 min-w-0">
                          {item.hospital}
                        </div>
                        {/* Fixed-width state column so VIC/QLD/NSW etc. all
                            line up at the same column across every row. */}
                        <span className="text-[10px] text-muted shrink-0 w-10 text-right tracking-[0.1em] uppercase font-semibold">
                          {item.state || "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[12px]">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full ${ACCENT_TAG[item.accent]} text-[10px] tracking-[0.12em] uppercase font-semibold`}
                        >
                          {item.role}
                        </span>
                      </div>
                    </div>

                    {/* Dedicated rate column so $250/hr, $200/hr etc. all line up
                        regardless of how long the role pill above is. */}
                    <div className="shrink-0 text-right min-w-[68px] md:min-w-[78px]">
                      <span className="display text-[15px] md:text-[16px] text-ink leading-none tabular-nums">
                        {item.rate}
                      </span>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end gap-1 min-w-[100px] md:min-w-[120px]">
                      {item.variant === "upcoming" ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-ocean/10 text-ocean text-[9px] tracking-[0.18em] uppercase font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-ocean" />
                          Starts {displayWhen(item, now)}
                        </span>
                      ) : i === 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-electric text-ink text-[9px] tracking-[0.18em] uppercase font-bold">
                          <span className={`w-1.5 h-1.5 rounded-full ${ACCENT_DOT[item.accent]}`} />
                          Just posted
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted tracking-[0.12em] uppercase">
                          {displayWhen(item, now)}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Footer counter */}
            <div className="px-5 md:px-6 py-3 border-t border-ink/8 flex items-center justify-between text-[10px] tracking-[0.22em] uppercase text-muted bg-white/60">
              <span>{arrivedCountRef.current} shifts since you arrived</span>
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new Event("open-download-modal"));
                  }
                }}
                className="text-ocean font-semibold hover:text-ink transition-colors"
                data-hover
              >
                Apply in the app →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

function timeAgo(then: number, now: number) {
  const sec = Math.max(1, Math.floor((now - then) / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  return `${hr}h ago`;
}
