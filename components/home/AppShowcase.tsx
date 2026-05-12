"use client";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  cubicBezier,
  type MotionValue,
} from "framer-motion";

type Step = {
  n: string;
  pill: string;
  title: string;
  body: string;
  screen: string;
  accent: "ocean" | "electric" | "leaf" | "stat";
};

const STEPS: Step[] = [
  {
    n: "01",
    pill: "Browse",
    title: "See every shift in your state.",
    body: "Real-time feed across Australia. Filter by specialty, rate, location, and date.",
    screen: "/screens/phone-browse-grid.png",
    accent: "ocean",
  },
  {
    n: "02",
    pill: "Rate",
    title: "Know your rate upfront.",
    body: "Posted directly by the hospital. No agency markup, no surprise on payday.",
    screen: "/screens/phone-shift-details.png",
    accent: "electric",
  },
  {
    n: "03",
    pill: "Apply",
    title: "Book in two taps.",
    body: "Credentials prefilled. Most hospitals confirm inside the hour.",
    screen: "/screens/phone-notifications.png",
    accent: "leaf",
  },
  {
    n: "04",
    pill: "Paid",
    title: "Paid in 48 hours.",
    body: "Money lands in your account within two business days. No invoicing.",
    screen: "/screens/phone-analytics.png",
    accent: "stat",
  },
];

const ACCENT_DOT: Record<Step["accent"], string> = {
  ocean: "bg-ocean",
  electric: "bg-electric",
  leaf: "bg-leaf",
  stat: "bg-stat",
};

const ACCENT_NUM: Record<Step["accent"], string> = {
  ocean: "text-ocean",
  electric: "text-electric-deep",
  leaf: "text-leaf",
  stat: "text-stat",
};

const ACCENT_GLOW: Record<Step["accent"], string> = {
  ocean: "rgba(50,50,255,0.18)",
  electric: "rgba(205,227,93,0.30)",
  leaf: "rgba(47,143,110,0.18)",
  stat: "rgba(255,90,54,0.18)",
};

export default function AppShowcase() {
  const sectionRef = useRef<HTMLElement>(null);

  // Drive each card's reveal off the section's scroll progress so cards land
  // one after another as the user scrolls past, even though they sit in a
  // single horizontal row.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.7", "end 0.65"],
  });
  // Smooth the raw scroll progress through a spring so the reveal feels
  // eased rather than tracking every scroll-wheel tick — fixes the jumpy
  // feel on cards 3 and 4 when the user flicks past quickly.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.4,
  });

  return (
    <section ref={sectionRef} className="relative bg-white py-20 md:py-24 px-6">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">
            How it works
          </div>
          <h2 className="display text-[clamp(28px,4.5vw,56px)] leading-[1.0]">
            From download to first shift{" "}
            <span className="italic text-ocean">in 24 hours</span>.
          </h2>
          <p className="mt-4 text-muted max-w-xl mx-auto text-[14px] md:text-[15px] leading-relaxed">
            Four steps, no recruiter calls.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {STEPS.map((step, i) => (
            <StepCard
              key={step.n}
              step={step}
              index={i}
              progress={smoothProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  index,
  progress,
}: {
  step: Step;
  index: number;
  progress: MotionValue<number>;
}) {
  // First card renders fully on entry; cards 2-4 reveal one-by-one as the
  // user scrolls through the section. Wider, evenly-spaced reveal windows
  // and a custom ease keep cards 3 and 4 from snapping in.
  const isFirst = index === 0;
  const ease = cubicBezier(0.2, 0.8, 0.2, 1);
  const start = isFirst ? -1 : 0.18 + (index - 1) * 0.22;
  const mid = isFirst ? -0.5 : start + 0.22;
  const end = isFirst ? 0 : start + 0.34;

  const opacity = useTransform(progress, [start, mid], [isFirst ? 1 : 0, 1], { ease });
  const y = useTransform(progress, [start, mid], [isFirst ? 0 : 24, 0], { ease });
  const pillOpacity = useTransform(progress, [mid, end], [isFirst ? 1 : 0, 1], { ease });
  const pillY = useTransform(progress, [mid, end], [isFirst ? 0 : 10, 0], { ease });

  return (
    <motion.div
      style={{ opacity, y }}
      whileHover={{ y: -1 }}
      transition={{ type: "tween", duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
      className="group relative rounded-3xl bg-lavender border border-ocean/10 overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-[0_20px_50px_-20px_rgba(50,50,255,0.2)]"
    >
      {/* steady accent glow, no hover brighten */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-32 h-64 blur-3xl opacity-50"
        style={{ background: ACCENT_GLOW[step.accent] }}
      />

      {/* `flex-1` lets the text section absorb any extra height the parent
          grid stretches to so the phone wrapper below always starts at the
          same offset from the bottom — keeping the 4 phones bottom-aligned
          regardless of how each card's body text wraps. */}
      <div className="relative p-6 md:p-7 pb-4 flex-1">
        <div className="flex items-center justify-between mb-5">
          <div
            className={`display text-[28px] md:text-[32px] leading-none ${ACCENT_NUM[step.accent]}`}
          >
            {step.n}
          </div>
          <span className={`w-2 h-2 rounded-full ${ACCENT_DOT[step.accent]}`} />
        </div>
        <h3 className="display text-[20px] md:text-[22px] leading-[1.2] text-ink">
          {step.title}
        </h3>
        <p className="mt-2.5 text-[13px] md:text-[14px] text-ink/65 leading-relaxed">
          {step.body}
        </p>
      </div>

      {/* phone preview — container is sized to the phone's actual height
          (width 160-170px × 19/9 aspect ≈ 338-359px) so the phone never
          overflows upward into the body text above. */}
      <div className="relative mt-4 mx-6 md:mx-7 mb-0 h-[350px] md:h-[370px] shrink-0">
        <PhonePreview
          step={step}
          index={index}
          pillOpacity={pillOpacity}
          pillY={pillY}
        />
      </div>
    </motion.div>
  );
}

function PhonePreview({
  step,
  index,
  pillOpacity,
  pillY,
}: {
  step: Step;
  index: number;
  pillOpacity: MotionValue<number>;
  pillY: MotionValue<number>;
}) {
  return (
    <div className="relative w-full h-full overflow-visible">
      {/* phone, bottom anchored so the top edge cleanly meets the pill row */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center">
        <div className="relative w-[160px] md:w-[170px]">
          <div className="relative aspect-[9/19] rounded-t-[30px] bg-ink shadow-[0_30px_70px_-25px_rgba(26,26,46,0.4)] p-[7px] pb-0 -mb-4">
            <div className="relative w-full h-full rounded-t-[24px] bg-white overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={step.screen}
                alt={step.title}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>

      {/* PRIMARY pill, sits centered above the phone's top edge so it never
          covers the active screen content. */}
      <motion.div
        style={{ opacity: pillOpacity, y: pillY }}
        className="absolute left-1/2 -translate-x-1/2 top-2 z-20 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-ink/10 shadow-[0_15px_40px_-15px_rgba(26,26,46,0.3)]"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${ACCENT_DOT[step.accent]}`} />
        <span className="text-[10px] tracking-[0.22em] uppercase font-semibold text-ink">
          {step.pill}
        </span>
      </motion.div>

      {/* SECONDARY pop, peeks out from the side of the phone, varies per card */}
      <SecondaryPop index={index} pillOpacity={pillOpacity} pillY={pillY} />
    </div>
  );
}

function SecondaryPop({
  index,
  pillOpacity,
  pillY,
}: {
  index: number;
  pillOpacity: MotionValue<number>;
  pillY: MotionValue<number>;
}) {
  // Position each pop on the OUTSIDE edge of the phone so it never overlaps
  // the live screen UI underneath.
  const sideClass =
    index % 2 === 0
      ? "left-0 md:-left-2 origin-left"
      : "right-0 md:-right-2 origin-right";

  if (index === 0) {
    return (
      <motion.div
        style={{ opacity: pillOpacity, y: pillY }}
        className={`absolute ${sideClass} top-[58%] z-30 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stat text-white shadow-[0_15px_30px_-10px_rgba(255,90,54,0.5)]`}
      >
        <span className="relative flex w-1.5 h-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
        </span>
        <span className="text-[9px] tracking-[0.2em] uppercase font-bold">
          Live
        </span>
      </motion.div>
    );
  }

  if (index === 1) {
    return (
      <motion.div
        style={{ opacity: pillOpacity, y: pillY }}
        className={`absolute ${sideClass} top-[55%] z-30 px-3 py-2 rounded-2xl bg-ink text-white shadow-[0_15px_40px_-15px_rgba(26,26,46,0.5)]`}
      >
        <div className="text-[9px] tracking-[0.22em] uppercase opacity-70">
          Posted rate
        </div>
        <div className="display text-[15px] leading-none mt-0.5">
          $250<span className="opacity-60 text-[10px]">/hr</span>
        </div>
      </motion.div>
    );
  }

  if (index === 2) {
    return (
      <motion.div
        style={{ opacity: pillOpacity, y: pillY }}
        className={`absolute ${sideClass} top-[60%] z-30 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-electric text-ink shadow-[0_15px_40px_-15px_rgba(205,227,93,0.6)]`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-leaf" />
        <span className="text-[10px] tracking-[0.18em] uppercase font-bold">
          Confirmed · 23 min
        </span>
      </motion.div>
    );
  }

  // index === 3
  return (
    <motion.div
      style={{ opacity: pillOpacity, y: pillY }}
      className={`absolute ${sideClass} top-[55%] z-30 px-3 py-2 rounded-2xl bg-white border border-ink/10 shadow-[0_15px_40px_-15px_rgba(26,26,46,0.3)]`}
    >
      <div className="text-[9px] tracking-[0.22em] uppercase text-muted">
        Wallet
      </div>
      <div className="display text-[15px] leading-none mt-0.5 text-ink">
        +$1,160
      </div>
    </motion.div>
  );
}
