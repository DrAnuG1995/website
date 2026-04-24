"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// "Stat" — the StatDoctor mascot. A friendly chick-sprout that lives
// in the bottom-left corner of the viewport and pipes up with helpful
// guidance as you scroll into new sections.
//
// Any element with `data-mascot="message..."` becomes a stop. When the
// element enters the viewport, Stat hops in place and a speech bubble
// appears above it with the message. Dismissable.

export default function Mascot() {
  const [message, setMessage] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [mood, setMood] = useState<"idle" | "hop">("idle");

  useEffect(() => {
    if (dismissed) return;

    const pickActive = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-mascot]"));
      let best: HTMLElement | null = null;
      let bestDist = Infinity;
      const mid = window.innerHeight / 2;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        // visible at all?
        if (r.bottom < 0 || r.top > window.innerHeight) continue;
        const cx = r.top + r.height / 2;
        const dist = Math.abs(cx - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = el;
        }
      }
      const msg = best?.dataset.mascot ?? null;
      setMessage((prev) => {
        if (msg && msg !== prev) {
          setMood("hop");
          setTimeout(() => setMood("idle"), 600);
        }
        return msg;
      });
    };

    pickActive();
    window.addEventListener("scroll", pickActive, { passive: true });
    window.addEventListener("resize", pickActive);
    return () => {
      window.removeEventListener("scroll", pickActive);
      window.removeEventListener("resize", pickActive);
    };
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div className="hidden lg:block fixed bottom-6 left-6 z-[95]">
      <div className="relative">
        {/* Speech bubble — above the mascot, always fits because left:24px */}
        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              key={message}
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute left-[88px] bottom-1 w-[260px] bg-ink text-bone rounded-2xl shadow-[0_14px_30px_-10px_rgba(26,26,46,0.3)] px-4 py-3"
            >
              {/* tail */}
              <div className="absolute left-0 bottom-6 -translate-x-1/2 w-3 h-3 bg-ink rotate-45" />
              <div className="flex items-center justify-between mb-1">
                <div className="mono text-[10px] tracking-widest text-electric">STAT · YOUR GUIDE</div>
                <button
                  onClick={() => setDismissed(true)}
                  className="w-5 h-5 rounded-full bg-bone/10 text-bone hover:bg-electric hover:text-ink grid place-items-center text-[11px] leading-none transition-colors"
                  aria-label="Dismiss guide"
                >
                  ×
                </button>
              </div>
              <div className="text-sm leading-snug">{message}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Character */}
        <motion.div
          animate={{
            y: mood === "hop" ? [-14, 0, -4, 0] : [0, -4, 0],
            scale: mood === "hop" ? [1, 1.06, 0.98, 1] : 1,
          }}
          transition={{
            y: {
              duration: mood === "hop" ? 0.6 : 3.2,
              repeat: mood === "hop" ? 0 : Infinity,
              ease: "easeInOut",
            },
            scale: { duration: 0.6, ease: "easeInOut" },
          }}
        >
          <svg
            width="72"
            height="80"
            viewBox="0 0 110 120"
            className="drop-shadow-[0_10px_20px_rgba(26,26,46,0.22)]"
          >
            <defs>
              <radialGradient id="mascot-body" cx="35%" cy="35%" r="75%">
                <stop offset="0%" stopColor="#FFF4C4" />
                <stop offset="60%" stopColor="#FFE69A" />
                <stop offset="100%" stopColor="#F5CE70" />
              </radialGradient>
              <radialGradient id="mascot-leaf" cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#C8EBA8" />
                <stop offset="100%" stopColor="#7BC08A" />
              </radialGradient>
              <radialGradient id="mascot-blush" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFB8B0" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FFB8B0" stopOpacity="0" />
              </radialGradient>
            </defs>

            <ellipse cx="55" cy="112" rx="30" ry="4" fill="#1a1a2e" opacity="0.12" />

            {/* sparkles */}
            <g opacity="0.85">
              <text x="14" y="36" fontSize="10" fill="#F5CE70">✦</text>
              <text x="92" y="32" fontSize="9" fill="#F5CE70">✦</text>
              <text x="16" y="82" fontSize="8" fill="#7BC08A">✦</text>
              <text x="94" y="84" fontSize="9" fill="#F5CE70">✦</text>
              <circle cx="10" cy="58" r="1.8" fill="#7BC08A" />
              <circle cx="100" cy="60" r="1.8" fill="#7BC08A" />
            </g>

            {/* stem */}
            <path d="M55 26 Q55 18 55 12" stroke="#7BC08A" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* heart leaves */}
            <path d="M55 14 C48 6 38 8 42 18 C44 22 50 22 55 18 Z" fill="url(#mascot-leaf)" stroke="#5A9E6F" strokeWidth="1.2" />
            <path d="M55 14 C62 6 72 8 68 18 C66 22 60 22 55 18 Z" fill="url(#mascot-leaf)" stroke="#5A9E6F" strokeWidth="1.2" />
            <ellipse cx="47" cy="12" rx="2" ry="1.2" fill="#F4FBE5" opacity="0.8" />

            {/* side nubs */}
            <ellipse cx="18" cy="72" rx="7" ry="9" fill="url(#mascot-body)" stroke="#E8B950" strokeWidth="1.2" />
            <ellipse cx="92" cy="72" rx="7" ry="9" fill="url(#mascot-body)" stroke="#E8B950" strokeWidth="1.2" />

            {/* body */}
            <path
              d="M55 28 C80 28 96 48 94 70 C93 88 78 102 55 102 C32 102 17 88 16 70 C14 48 30 28 55 28 Z"
              fill="url(#mascot-body)"
              stroke="#E8B950"
              strokeWidth="1.8"
            />
            <ellipse cx="40" cy="48" rx="14" ry="8" fill="#FFFBE6" opacity="0.55" />

            {/* cheeks */}
            <circle cx="33" cy="72" r="9" fill="url(#mascot-blush)" />
            <circle cx="77" cy="72" r="9" fill="url(#mascot-blush)" />

            {/* eyes */}
            <ellipse cx="43" cy="66" rx="2.8" ry="3.2" fill="#3a2418" />
            <ellipse cx="67" cy="66" rx="2.8" ry="3.2" fill="#3a2418" />
            <circle cx="44.3" cy="64.8" r="1" fill="#FFFBE6" />
            <circle cx="68.3" cy="64.8" r="1" fill="#FFFBE6" />

            {/* beak */}
            <path d="M52 73 Q55 78 58 73 Q55 76 52 73 Z" fill="#F5A84A" stroke="#D88E34" strokeWidth="0.8" />
            <path d="M53 74 L57 74" stroke="#D88E34" strokeWidth="0.6" strokeLinecap="round" />

            {/* doctor bandage */}
            <g transform="translate(82 82) rotate(25)">
              <rect x="-5" y="-2" width="10" height="4" rx="1" fill="#FFCFD0" stroke="#E89898" strokeWidth="0.6" />
              <circle cx="-2.5" cy="0" r="0.5" fill="#E89898" />
              <circle cx="2.5" cy="0" r="0.5" fill="#E89898" />
            </g>

            {/* feet */}
            <ellipse cx="44" cy="103" rx="6" ry="4" fill="#F5A84A" stroke="#D88E34" strokeWidth="1.2" />
            <ellipse cx="66" cy="103" rx="6" ry="4" fill="#F5A84A" stroke="#D88E34" strokeWidth="1.2" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
