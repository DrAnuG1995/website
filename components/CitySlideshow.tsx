"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Shared Ken-Burns–style hero background. One <CitySlideshow> renders:
//   - a stack of full-bleed crossfading photos (slow zoom in/out per
//     frame for the Ken Burns effect),
//   - a small caption pill in the bottom-right corner showing the town
//     + state of whatever slide is currently dominant on screen.
//
// Used on both /for-doctors and /hospitals as the hero background.
// Drop a new photo into public/hospitals/<city>.jpg and append a frame
// to the page's HERO_SLIDES list — both pages stay in lock-step.

export type CitySlide = {
  src: string;
  alt: string;
  town: string;
  state: string;
};

const DEFAULT_INTERVAL_MS = 5500;
// Photo crossfade duration — matches the motion transition. Caption
// flip is delayed by half this so the label changes when both photos
// are at equal opacity (avoids the caption naming the next slide
// before the next slide is visually dominant).
const CROSSFADE_MS = 1400;

export default function CitySlideshow({
  slides,
  intervalMs = DEFAULT_INTERVAL_MS,
}: {
  slides: CitySlide[];
  intervalMs?: number;
}) {
  const [active, setActive] = useState(0);
  const [captionIndex, setCaptionIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(
      () => setActive((a) => (a + 1) % slides.length),
      intervalMs,
    );
    return () => window.clearInterval(id);
  }, [slides.length, intervalMs]);

  useEffect(() => {
    const id = window.setTimeout(
      () => setCaptionIndex(active),
      CROSSFADE_MS / 2,
    );
    return () => window.clearTimeout(id);
  }, [active]);

  if (slides.length === 0) return null;
  const current = slides[captionIndex];

  return (
    <>
      <div className="absolute inset-0 overflow-hidden bg-ink">
        {slides.map((s, i) => (
          <motion.div
            key={s.src}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === active ? 1 : 0 }}
            transition={{ duration: CROSSFADE_MS / 1000, ease: "easeInOut" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src={s.src}
              alt={s.alt}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              className="w-full h-full object-cover"
              initial={{ scale: 1.08 }}
              animate={{ scale: i === active ? 1.2 : 1.08 }}
              transition={{ duration: intervalMs / 1000, ease: "linear" }}
            />
          </motion.div>
        ))}
      </div>

      {/* Region caption — crossfades with each slide. Bottom-right
          corner so it never collides with hero copy/CTAs. */}
      <div className="absolute bottom-5 right-5 md:bottom-7 md:right-7 z-20 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${current.town}-${current.state}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-ink/60 backdrop-blur-md border border-bone/15"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-electric" />
            <span className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase font-semibold text-white whitespace-nowrap">
              {current.town} · {current.state}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
