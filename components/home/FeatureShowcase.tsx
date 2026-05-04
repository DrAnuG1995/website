"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

type Feature = {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  accent: "ocean" | "electric" | "leaf";
  visual: { kind: "phone"; src: string } | { kind: "credentials" };
};

const FEATURES: Feature[] = [
  {
    eyebrow: "Calendar",
    title: "Your shifts. Your week. One view.",
    body: "Every confirmed shift lives in a single calendar that syncs with your phone. No more juggling agency emails to remember where you're supposed to be on Saturday.",
    bullets: [
      "Sync to iOS / Google Calendar in one tap",
      "See pay totals per week or month",
      "Travel and accommodation details inline",
    ],
    accent: "ocean",
    visual: { kind: "phone", src: "/screens/phone-calendar.png" },
  },
  {
    eyebrow: "Verification",
    title: "Credential once. Apply forever.",
    body: "Upload AHPRA, indemnity, and CV when you sign up. We verify overnight. After that, every shift application is a single tap, no re-uploading the same documents to a new agency every month.",
    bullets: [
      "AHPRA, indemnity, CV, once",
      "Vault is encrypted and private",
      "Hospitals see only what's relevant",
    ],
    accent: "electric",
    visual: { kind: "phone", src: "/screens/phone-verification.png" },
  },
  {
    eyebrow: "Notifications",
    title: "The hospital responds. You know instantly.",
    body: "Confirmations land as a push the moment a hospital approves your application, usually inside the hour. No refreshing email, no agency rep ringing you at 9pm.",
    bullets: [
      "Push, email, or both, your call",
      "Quiet hours respected",
      "Cancellations notify with one tap",
    ],
    accent: "leaf",
    visual: { kind: "phone", src: "/screens/phone-notifications.png" },
  },
  {
    eyebrow: "Earnings",
    title: "Know your numbers.",
    body: "Lifetime earnings, per-month totals, and a shift-by-shift breakdown. Export a clean CSV your accountant won't complain about.",
    bullets: [
      "Lifetime + per-month totals",
      "Auto-categorised for tax",
      "CSV export to your accountant",
    ],
    accent: "ocean",
    visual: { kind: "phone", src: "/screens/phone-analytics.png" },
  },
];

export default function FeatureShowcase() {
  return (
    <section className="relative bg-white">
      <div className="max-w-[1280px] mx-auto px-6 pt-12 md:pt-16 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">
            For doctors
          </div>
          <h2 className="display text-[clamp(28px,4.5vw,56px)] leading-[1.0]">
            Built for the way{" "}
            <span className="italic text-ocean">doctors actually work</span>.
          </h2>
        </motion.div>
      </div>

      <div className="relative">
        {FEATURES.map((feature, i) => (
          <FeatureRow key={feature.title} feature={feature} index={i} />
        ))}
      </div>
    </section>
  );
}

function FeatureRow({ feature, index }: { feature: Feature; index: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const reverse = index % 2 === 1;

  // Per-row scroll progress drives a gentle parallax on the phone + halo.
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "end start"],
  });
  const phoneY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const haloY = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const haloOpacity = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [0, 1, 1, 0]
  );

  const accentColor =
    feature.accent === "ocean"
      ? "rgba(50,50,255,0.18)"
      : feature.accent === "electric"
      ? "rgba(205,227,93,0.30)"
      : "rgba(47,143,110,0.18)";

  const accentDot =
    feature.accent === "ocean"
      ? "bg-ocean"
      : feature.accent === "electric"
      ? "bg-electric"
      : "bg-leaf";

  return (
    <div
      ref={rowRef}
      className="relative max-w-[1280px] mx-auto px-6 py-12 md:py-16"
    >
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center ${
          reverse ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        {/* TEXT side */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-muted mb-4">
            <span className={`w-1.5 h-1.5 rounded-full ${accentDot}`} />
            {feature.eyebrow}
          </div>
          <h3 className="display text-[clamp(26px,3.5vw,44px)] leading-[1.05]">
            {feature.title}
          </h3>
          <p className="mt-5 text-muted text-[15px] md:text-base leading-relaxed max-w-md">
            {feature.body}
          </p>
          <ul className="mt-6 space-y-2.5 max-w-md">
            {feature.bullets.map((b, j) => (
              <motion.li
                key={b}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + j * 0.08,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
                className="flex items-start gap-3 text-[14px] md:text-[15px] text-ink/80"
              >
                <span
                  className={`mt-1.5 w-1.5 h-1.5 rounded-full ${accentDot} shrink-0`}
                />
                {b}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* VISUAL side, phone or credential stack, with parallax + halo */}
        <div className="relative flex justify-center">
          <motion.div
            aria-hidden
            style={{ y: haloY, opacity: haloOpacity }}
            className="absolute inset-0 -z-0 blur-3xl rounded-full"
          >
            <div
              className="w-full h-full rounded-full"
              style={{ background: accentColor }}
            />
          </motion.div>

          {feature.visual.kind === "phone" ? (
            <PhoneVisual
              src={feature.visual.src}
              alt={feature.title}
              eyebrow={feature.eyebrow}
              accentDot={accentDot}
              reverse={reverse}
              parallaxY={phoneY}
            />
          ) : (
            <CredentialVisual
              accentDot={accentDot}
              reverse={reverse}
              parallaxY={phoneY}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- visuals ---------- */
function PhoneVisual({
  src,
  alt,
  eyebrow,
  accentDot,
  reverse,
  parallaxY,
}: {
  src: string;
  alt: string;
  eyebrow: string;
  accentDot: string;
  reverse: boolean;
  parallaxY: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ y: parallaxY }}
      className="relative w-[220px] md:w-[260px] lg:w-[280px]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, rotate: reverse ? 4 : -4 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative aspect-[9/19] rounded-[40px] bg-ink shadow-[0_50px_120px_-30px_rgba(26,26,46,0.4)] p-2.5"
      >
        <div className="relative w-full h-full rounded-[32px] bg-white overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className={`absolute ${
          reverse ? "-left-6 md:-left-10" : "-right-6 md:-right-10"
        } top-12 md:top-16 px-3 py-2 rounded-2xl bg-white border border-ink/10 shadow-[0_15px_40px_-15px_rgba(26,26,46,0.25)] text-[10px] tracking-[0.22em] uppercase font-semibold flex items-center gap-2`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${accentDot}`} />
        <span className="text-ink">{eyebrow}</span>
      </motion.div>
    </motion.div>
  );
}

function CredentialVisual({
  accentDot,
  reverse,
  parallaxY,
}: {
  accentDot: string;
  reverse: boolean;
  parallaxY: MotionValue<number>;
}) {
  const cards = [
    {
      kind: "AHPRA",
      label: "Registration",
      meta: "MED0001234567 · Active",
      tone: "ocean",
    },
    {
      kind: "Indemnity",
      label: "Avant Mutual",
      meta: "Cover to 30 Jun 2027",
      tone: "ink",
    },
    {
      kind: "CV",
      label: "Curriculum vitae",
      meta: "Updated · 12 pages",
      tone: "leaf",
    },
  ] as const;

  return (
    <motion.div
      style={{ y: parallaxY }}
      className="relative w-[280px] md:w-[340px] lg:w-[380px] aspect-square"
    >
      {/* The cards: each enters from the side, settles into a slight fan */}
      {cards.map((c, i) => {
        const offset = i - 1; // -1, 0, 1
        const initialX = (reverse ? -1 : 1) * (60 + i * 30);
        const restRotate = offset * 5; // -5°, 0°, 5°
        const restY = i * 14;
        const restX = offset * 18;

        const tone =
          c.tone === "ocean"
            ? "border-ocean/40"
            : c.tone === "leaf"
            ? "border-leaf/40"
            : "border-ink/30";

        return (
          <motion.div
            key={c.kind}
            initial={{ opacity: 0, x: initialX, rotate: restRotate * 2.5, y: restY - 30 }}
            whileInView={{
              opacity: 1,
              x: restX,
              y: restY,
              rotate: restRotate,
            }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.85,
              delay: 0.1 + i * 0.12,
              ease: [0.2, 0.8, 0.2, 1],
            }}
            style={{ zIndex: 10 + i }}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] md:w-[280px] aspect-[1.6/1] rounded-2xl bg-white border ${tone} shadow-[0_30px_70px_-25px_rgba(26,26,46,0.35)] p-5 flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between">
              <div className="text-[9px] tracking-[0.22em] uppercase text-muted font-semibold">
                {c.kind}
              </div>
              <span className={`w-1.5 h-1.5 rounded-full ${accentDot}`} />
            </div>
            <div>
              <div className="display text-[18px] md:text-[20px] leading-tight">
                {c.label}
              </div>
              <div className="text-[11px] text-muted mt-1.5">{c.meta}</div>
            </div>
            <div className="flex items-center justify-between text-[9px] tracking-[0.22em] uppercase text-muted">
              <span>StatDoctor vault</span>
              <span>•••• {String(1234 + i * 11).slice(-4)}</span>
            </div>
          </motion.div>
        );
      })}

      {/* Verified stamp, lands last, slight pop */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, rotate: -18 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          duration: 0.6,
          delay: 0.65,
          ease: [0.34, 1.56, 0.64, 1], // gentle overshoot
        }}
        className="absolute right-2 md:-right-2 top-4 md:top-6 z-30 inline-flex items-center gap-2 rounded-full bg-electric text-ink px-4 py-2 shadow-[0_15px_40px_-15px_rgba(205,227,93,0.7)] border border-ink/10"
      >
        <CheckIcon />
        <span className="display text-[13px] md:text-[14px] font-semibold tracking-tight">
          Verified
        </span>
      </motion.div>

      {/* Subtle "1 upload" badge, bottom corner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.85 }}
        className="absolute left-2 md:-left-2 bottom-6 z-30 px-3 py-2 rounded-2xl bg-white border border-ink/10 shadow-[0_15px_40px_-15px_rgba(26,26,46,0.25)] text-[10px] tracking-[0.22em] uppercase font-semibold flex items-center gap-2"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${accentDot}`} />
        <span className="text-ink">1 upload · every shift</span>
      </motion.div>
    </motion.div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
