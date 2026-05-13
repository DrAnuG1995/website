"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const TEXT = "We are not an agency, and we are proud of that.";
const WORDS = TEXT.split(" ");

// Each word lights up from a very-pale blue to the full brand blue as the
// scroll progress passes over it — so the line reads like ink being drawn
// in from left to right while the user scrolls.
export default function NotAnAgency() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // Begin once the section's top enters the lower 80% of the viewport,
    // finish when the bottom passes the upper 20%. This stretches the
    // animation across the natural read time of the line.
    offset: ["start 75%", "end 25%"],
  });

  return (
    <section
      ref={ref}
      className="relative bg-white pt-20 pb-12 md:pt-28 md:pb-16 px-6 overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 50%, rgba(50,50,255,0.08), transparent 70%)",
        }}
      />
      <div className="relative max-w-[1280px] mx-auto text-center">
        <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-6 md:mb-8">
          Built different
        </div>
        <h2 className="display text-[clamp(36px,7.5vw,96px)] leading-[1.05] tracking-tight">
          {WORDS.map((word, i) => (
            <RevealWord
              key={i}
              progress={scrollYProgress}
              index={i}
              total={WORDS.length}
            >
              {word}
            </RevealWord>
          ))}
        </h2>
        <p className="mt-8 md:mt-10 mx-auto max-w-[640px] text-[clamp(14px,1.5vw,18px)] leading-relaxed text-ink/65">
          We facilitate locum contracts directly between doctors and healthcare
          services. Full locum rates, with no agency in the chain.
        </p>
      </div>
    </section>
  );
}

function RevealWord({
  progress,
  index,
  total,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  children: React.ReactNode;
}) {
  // Compress the whole reveal into the first ~45% of scroll progress so the
  // line goes fully blue before the user is even halfway through the
  // section — feels punchier than spreading it across the whole scroll.
  const slice = 0.45 / total;
  const start = Math.max(0, index * slice - slice * 0.5);
  const end = Math.min(1, (index + 1) * slice + slice * 0.1);

  const color = useTransform(
    progress,
    [start, end],
    ["rgba(50, 50, 255, 0.18)", "rgba(50, 50, 255, 1)"],
  );

  return (
    <motion.span
      style={{ color }}
      className="inline-block mr-[0.22em] last:mr-0 transition-none"
    >
      {children}
    </motion.span>
  );
}
