"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { fetchLiveStats, type LiveStats } from "@/lib/hospitals";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export default function LiveStatsStrip({ initial }: { initial: LiveStats }) {
  const [stats, setStats] = useState<LiveStats>(initial);

  // Keep the strip in sync with the CRM while the tab is open. Two channels:
  //   1. Supabase realtime channel — instant push when shifts/hospitals
  //      change (requires those tables to be in the supabase_realtime
  //      publication; see migration 011).
  //   2. 15-second polling fallback — guarantees freshness even if realtime
  //      isn't configured, and acts as a backstop if a websocket drops.
  // Both paths call the same refresh() so duplicate fires are harmless.
  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    let cancelled = false;
    const refresh = async () => {
      const fresh = await fetchLiveStats();
      if (!cancelled) setStats(fresh);
    };
    const channel = supabase
      .channel("live-stats")
      .on("postgres_changes", { event: "*", schema: "public", table: "shifts" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "hospitals" }, refresh)
      .subscribe();
    // Poll every 15 minutes — matches the CRM's admin-portal sync cadence.
    const interval = window.setInterval(refresh, 15 * 60 * 1000);
    // Also refresh when the tab regains focus — covers users who leave the
    // page open for hours.
    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const cards: {
    to: number;
    format: (n: number) => string;
    label: string;
    icon: "calendar" | "check" | "dollar" | "trend";
    accent: "leaf" | "ocean" | "ink" | "leaf2";
  }[] = [
    {
      to: stats.activeShifts,
      format: (n) => formatNumber(Math.round(n)),
      label: "Active shifts",
      icon: "calendar",
      accent: "leaf",
    },
    {
      to: stats.confirmedShifts,
      format: (n) => formatNumber(Math.round(n)),
      label: "Confirmed",
      icon: "check",
      accent: "ocean",
    },
    {
      to: stats.avgRate,
      format: (n) => (stats.avgRate > 0 ? `$${Math.round(n)}/hr` : "-"),
      label: "Avg rate",
      icon: "dollar",
      accent: "ink",
    },
    {
      to: stats.totalValue,
      format: (n) => formatCurrency(n),
      label: "Total value",
      icon: "trend",
      accent: "leaf2",
    },
  ];

  return (
    <section className="relative bg-white pt-2 pb-8 md:pt-3 md:pb-10 px-4 md:px-6">
      <div className="max-w-[1320px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {cards.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-2xl border border-ink/10 bg-white p-4 md:p-5 flex items-center gap-3 md:gap-4 shadow-[0_15px_40px_-20px_rgba(26,26,46,0.12)]"
            >
              <StatIcon icon={c.icon} accent={c.accent} />
              <div className="min-w-0 flex-1">
                <div className="display text-[clamp(20px,2.4vw,30px)] leading-none tracking-tight text-ink truncate tabular-nums">
                  <AnimatedValue to={c.to} format={c.format} />
                </div>
                <div className="text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-muted mt-1">
                  {c.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Counts up from the previously-shown value to the target so initial loads
// go 0 → N (impactful first impression) and subsequent realtime updates
// glide smoothly to the new value rather than snapping.
function AnimatedValue({
  to,
  format,
  duration = 1.8,
}: {
  to: number;
  format: (n: number) => string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // amount: 0.5 means the animation only triggers once the user has
  // actually scrolled enough for half the value to be visible — so the
  // numbers stay at 0 on initial page load if the strip is still off-screen.
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [v, setV] = useState(0);
  const prevToRef = useRef(0);

  useEffect(() => {
    if (!inView) return;
    const from = prevToRef.current;
    const start = performance.now();
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setV(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    prevToRef.current = to;
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return <span ref={ref}>{format(v)}</span>;
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-AU");
}

function formatCurrency(n: number): string {
  if (n >= 1_000_000) {
    return `$${(n / 1_000_000).toFixed(n >= 10_000_000 ? 1 : 2)}M`;
  }
  if (n >= 1_000) {
    return `$${Math.round(n / 1_000)}K`;
  }
  return `$${Math.round(n).toLocaleString("en-AU")}`;
}

function StatIcon({
  icon,
  accent,
}: {
  icon: "calendar" | "check" | "dollar" | "trend";
  accent: "leaf" | "ocean" | "ink" | "leaf2";
}) {
  const bg: Record<typeof accent, string> = {
    leaf: "bg-leaf",
    ocean: "bg-ocean",
    ink: "bg-ink",
    leaf2: "bg-electric",
  } as const;
  const fg: Record<typeof accent, string> = {
    leaf: "text-white",
    ocean: "text-white",
    ink: "text-white",
    leaf2: "text-ink",
  } as const;

  return (
    <div className={`shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-xl ${bg[accent]} ${fg[accent]} grid place-items-center`}>
      {icon === "calendar" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="8" y1="3" x2="8" y2="7" />
          <line x1="16" y1="3" x2="16" y2="7" />
        </svg>
      )}
      {icon === "check" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <polyline points="8 12 11 15 16 9" />
        </svg>
      )}
      {icon === "dollar" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <line x1="12" y1="3" x2="12" y2="21" />
          <path d="M16 6H9.5a2.5 2.5 0 000 5h5a2.5 2.5 0 010 5H7" />
        </svg>
      )}
      {icon === "trend" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="3 17 9 11 13 15 21 7" />
          <polyline points="15 7 21 7 21 13" />
        </svg>
      )}
    </div>
  );
}
