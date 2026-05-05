"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Shift = {
  hospital: string;
  state: string;
  role: string;
  rate: string;
  accent: "ocean" | "electric" | "leaf" | "stat";
};

// Pool drawn from the real partner-hospital database (components/home/hospitals.ts).
// Each entry references a hospital that's already on the live map, so the
// "live feed" actually corresponds to the network we list elsewhere.
const SHIFT_POOL: Shift[] = [
  { hospital: "Bendigo Health", state: "VIC", role: "ED Registrar", rate: "$165/hr", accent: "ocean" },
  { hospital: "Knox Private Hospital ED", state: "VIC", role: "ED HMO", rate: "$140/hr", accent: "leaf" },
  { hospital: "Mater Private Brisbane", state: "QLD", role: "Anaesthetics", rate: "$210/hr", accent: "electric" },
  { hospital: "Hobart Private Hospital", state: "TAS", role: "ED Registrar", rate: "$175/hr", accent: "stat" },
  { hospital: "Tom Price Hospital", state: "WA", role: "Rural GP", rate: "$280/hr", accent: "stat" },
  { hospital: "Hollywood Private Hospital", state: "WA", role: "Surgery Reg", rate: "$220/hr", accent: "ocean" },
  { hospital: "Bundaberg Hospital", state: "QLD", role: "ED HMO", rate: "$155/hr", accent: "leaf" },
  { hospital: "CBD Doctors Melbourne", state: "VIC", role: "GP Locum", rate: "$160/hr", accent: "electric" },
  { hospital: "Mater Private Townsville", state: "QLD", role: "ED Registrar", rate: "$185/hr", accent: "ocean" },
  { hospital: "Yarrawonga Health", state: "VIC", role: "GP Locum", rate: "$170/hr", accent: "leaf" },
  { hospital: "HEAL Urgent Care Newcastle", state: "NSW", role: "Urgent Care", rate: "$180/hr", accent: "stat" },
  { hospital: "Kalgoorlie Hospital", state: "WA", role: "Rural GP", rate: "$240/hr", accent: "electric" },
];

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

type FeedItem = Shift & { id: number; postedAt: number };

const VISIBLE = 5;
// Hospitals don't post shifts every few seconds, they post every few hours.
// New entry every hour. Seeded entries span the last ~14 hours so the times
// read like a realistic "today's posts" feed at first glance.
const POST_INTERVAL_MS = 60 * 60 * 1000;

const SEED_AGE_MIN = [12, 65, 150, 320, 700]; // minutes ago, top → bottom

export default function LiveShiftFeed() {
  const [items, setItems] = useState<FeedItem[]>(() => {
    const now = Date.now();
    return SHIFT_POOL.slice(0, VISIBLE).map((s, i) => ({
      ...s,
      id: i,
      postedAt: now - SEED_AGE_MIN[i] * 60_000,
    }));
  });
  const [now, setNow] = useState(() => Date.now());
  const idRef = useRef(VISIBLE);

  // Push a new shift every interval, cycle through pool, then random.
  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        const next: FeedItem = {
          ...SHIFT_POOL[idRef.current % SHIFT_POOL.length],
          id: idRef.current,
          postedAt: Date.now(),
        };
        idRef.current += 1;
        return [next, ...prev].slice(0, VISIBLE);
      });
    }, POST_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Tick clock every second so timestamps stay fresh.
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

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
            <div className="text-[10px] tracking-[0.22em] uppercase text-bone/55">
              Auto-updating
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
                    className="px-5 md:px-6 py-4 flex items-center gap-4 bg-lavender min-h-[76px]"
                  >
                    {/* Hospital initials avatar */}
                    <div
                      className={`relative shrink-0 w-10 h-10 rounded-full grid place-items-center text-[12px] font-semibold ${ACCENT_TAG[item.accent]}`}
                    >
                      {initials(item.hospital)}
                      {i === 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-stat ring-2 ring-lavender" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-[14px] font-semibold text-ink truncate">
                          {item.hospital}
                        </div>
                        <span className="text-[10px] text-muted shrink-0">
                          · {item.state}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[12px]">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full ${ACCENT_TAG[item.accent]} text-[10px] tracking-[0.12em] uppercase font-semibold`}
                        >
                          {item.role}
                        </span>
                        <span className="text-muted">·</span>
                        <span className="display text-[14px] text-ink leading-none">
                          {item.rate}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end gap-1">
                      {i === 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-electric text-ink text-[9px] tracking-[0.18em] uppercase font-bold">
                          <span className={`w-1.5 h-1.5 rounded-full ${ACCENT_DOT[item.accent]}`} />
                          Just posted
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted tracking-[0.12em] uppercase">
                          {timeAgo(item.postedAt, now)}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Footer counter */}
            <div className="px-5 md:px-6 py-3 border-t border-ink/8 flex items-center justify-between text-[10px] tracking-[0.22em] uppercase text-muted bg-white/60">
              <span>{idRef.current} shifts since you arrived</span>
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
