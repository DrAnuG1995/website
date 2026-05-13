"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Counter from "@/components/Counter";
import CitySlideshow from "@/components/CitySlideshow";
import { HERO_CITY_SLIDES } from "@/lib/hero-slides";
import { PARTNER_LOGOS } from "@/lib/partner-logos";
import { AGENCY_FEES_SAVED_AUD, VERIFIED_DOCTORS } from "@/lib/marketing-stats";

/* ============================================================
   /hospitals, sales landing page for hospital admins.
   Mirrors the home page design system (eyebrows, italic-ocean
   accent, Cormorant display, lavender card tint, rounded-3xl).
   Real dashboard screenshots from the StatHospital admin product
   live in /public/screens/stathospital-*.
   ============================================================ */

export default function HospitalsClient({
  partnerCount,
}: {
  // Live partner count fetched server-side in page.tsx. Defaults to 0
  // when the CRM is unreachable so the page still renders cleanly.
  partnerCount?: number;
}) {
  const goContact = () => {
    if (typeof window !== "undefined") {
      window.open(
        "https://meetings-ap1.hubspot.com/anu-ganugapati/statdoctor-demo?uuid=036c5fa9-44dc-4e52-8254-9888ebeec958",
        "_blank",
        "noopener,noreferrer"
      );
    }
  };
  return (
    <div className="bg-white text-ink">
      <Hero onContact={goContact} partnerCount={partnerCount ?? 0} />
      <HospitalLogosStrip partnerCount={partnerCount ?? 0} />
      <HowItWorks />
      <HospitalDemoVideo />
      <Comparison />
      <Pricing onContact={goContact} />
      <PermHireCallout onContact={goContact} />
      <HospitalFAQ />
      <ClosingCTA onContact={goContact} />
    </div>
  );
}

/* ---------- HERO ---------- */
function Hero({
  onContact,
  partnerCount,
}: {
  onContact: () => void;
  partnerCount: number;
}) {
  // Three stats: a verified-doctor count from the shared marketing
  // constant (kept identical across the public site), a live partner
  // count straight from the CRM, and the cumulative agency-fees-saved
  // value-prop counter. The agency-fees number is a curated marketing
  // claim from lib/marketing-stats.ts — bump it as ops verifies new
  // thresholds.
  const stats = [
    {
      to: VERIFIED_DOCTORS,
      prefix: "",
      suffix: "+",
      label: "Verified Australian doctors",
      live: false,
    },
    {
      to: partnerCount > 0 ? partnerCount : 60,
      prefix: "",
      suffix: partnerCount > 0 ? "" : "+",
      label: "Partner clinics & hospitals",
      live: partnerCount > 0,
    },
    {
      to: AGENCY_FEES_SAVED_AUD,
      prefix: "$",
      suffix: "+",
      label: "Saved in recruitment fees",
      live: false,
    },
  ];
  return (
    <section className="relative overflow-hidden text-bone min-h-[640px] md:min-h-[720px] flex items-center pt-32 md:pt-36 pb-12 md:pb-16 px-6">
      {/* Ken Burns–style city slideshow as the hero background, same
          component + same source list /for-doctors uses so the two
          pages stay in lock-step. Drop a new photo into
          public/hospitals/<city>.jpg and append it to HERO_CITY_SLIDES
          to add a slide. */}
      <CitySlideshow slides={HERO_CITY_SLIDES} />
      {/* Layered overlay: a strong ink wash for legibility + the same
          ocean/electric radial accents we use elsewhere so the hero
          still reads as part of the site's visual language. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(26,26,46,0.78), rgba(26,26,46,0.62) 55%, rgba(26,26,46,0.85))",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen"
        style={{
          background:
            "radial-gradient(40% 40% at 80% 20%, rgba(50,50,255,0.45), transparent 70%), radial-gradient(40% 40% at 15% 80%, rgba(205,227,93,0.25), transparent 70%)",
        }}
      />

      <div className="relative max-w-[1100px] mx-auto text-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="text-[10px] tracking-[0.22em] uppercase text-bone/70 mb-3">
            For hospitals
          </div>
          <h1 className="display text-white text-[clamp(36px,6vw,84px)] leading-[0.98]">
            Fill shifts faster.{" "}
            <span className="italic text-electric">Pay agencies less</span>.
          </h1>
          <p className="mt-5 text-bone/80 max-w-xl mx-auto text-[15px] md:text-base leading-relaxed">
            Post a shift directly to {VERIFIED_DOCTORS}+ verified Australian
            doctors. Review credentials in seconds, confirm in one tap, settle
            in 48 hours, no recruiter, no markup.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onContact}
              className="inline-flex items-center justify-center gap-2 w-[210px] px-5 py-3 rounded-full bg-electric text-ink text-sm font-semibold hover:bg-white transition-colors"
              data-hover
            >
              Book a 15-min demo
              <span aria-hidden>→</span>
            </button>
            <a
              href="#how"
              className="inline-flex items-center justify-center gap-2 w-[210px] px-5 py-3 rounded-full border border-bone/40 text-bone text-sm font-medium hover:bg-bone/10 hover:border-bone transition-colors"
              data-hover
            >
              How it works
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="relative rounded-3xl bg-white/8 backdrop-blur-md border border-bone/15 px-6 py-7 md:py-8"
            >
              {s.live && (
                <span className="absolute top-4 right-4 inline-flex items-center gap-1.5">
                  <span className="relative w-1.5 h-1.5">
                    <span className="absolute inset-0 rounded-full bg-electric animate-ping opacity-75" />
                    <span className="relative block w-1.5 h-1.5 rounded-full bg-electric" />
                  </span>
                  <span className="text-[9px] tracking-[0.22em] uppercase font-semibold text-bone/70">
                    Live
                  </span>
                </span>
              )}
              <div className="display text-[clamp(36px,4.6vw,56px)] leading-none text-white tabular-nums">
                <Counter
                  to={s.to}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  duration={1.6 + i * 0.2}
                />
              </div>
              <div className="mt-3 text-[12px] md:text-[13px] text-bone/75 leading-snug">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- HOSPITAL LOGOS STRIP ----------
   Same partner-logos marquee the homepage uses (PARTNER_LOGOS from
   lib/partner-logos.ts). One source list keeps the homepage and
   /hospitals page in lock-step — add a logo there and both update.
   Live partner count from the CRM appears in the eyebrow under the
   headline. */
function HospitalLogosStrip({ partnerCount }: { partnerCount: number }) {
  // Doubled so the -50% keyframe wraps onto an identical copy of the
  // first slot — no visible seam at the loop point.
  const doubled = [...PARTNER_LOGOS, ...PARTNER_LOGOS];
  return (
    <section className="py-12 md:py-14 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 mb-8 md:mb-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center gap-3 md:gap-4"
        >
          <div>
            <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-2">
              The network
            </div>
            <h2 className="display text-[clamp(22px,3vw,38px)] leading-[1.05] max-w-2xl mx-auto">
              Hospitals from{" "}
              <span className="italic text-ocean">Cairns to Hobart</span>{" "}
              fill shifts here.
            </h2>
          </div>
          <Link
            href="/partners"
            className="group inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-muted hover:text-ocean transition-colors"
            data-hover
          >
            {partnerCount > 0
              ? `${partnerCount} hospitals · growing weekly`
              : "Growing weekly"}
            <span
              aria-hidden
              className="inline-block transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </motion.div>
      </div>

      <div className="marquee-mask">
        <div className="flex w-max items-center animate-marquee-slow hover:[animation-play-state:paused]">
          {doubled.map((logo, i) => (
            <div
              key={i}
              className="shrink-0 w-[150px] md:w-[170px] flex items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt=""
                style={{ height: `${logo.h ?? 51}px` }}
                className="w-auto max-w-[120px] md:max-w-[140px] opacity-60 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- HOW IT WORKS, 4 cards with real dashboard screenshots ---------- */
type Step = {
  n: string;
  pill: string;
  title: string;
  body: string;
  src: string;
  accent: "ocean" | "electric" | "leaf" | "stat";
};

const STEPS: Step[] = [
  {
    n: "01",
    pill: "Post",
    title: "Post a shift in 90 seconds.",
    body: `Specialty, date, hours, rate, location. Live to ${VERIFIED_DOCTORS}+ verified doctors.`,
    src: "/screens/stathospital-post-requirements.png",
    accent: "ocean",
  },
  {
    n: "02",
    pill: "Review",
    title: "See who applied with credentials.",
    body: "AHPRA, indemnity, CV, ratings, history, all visible at a glance.",
    src: "/screens/stathospital-applicant-overview.png",
    accent: "electric",
  },
  {
    n: "03",
    pill: "Confirm",
    title: "One tap to confirm.",
    body: "The doctor is notified instantly. Most shifts are confirmed inside 30 minutes.",
    src: "/screens/stathospital-multiday.png",
    accent: "leaf",
  },
  {
    n: "04",
    pill: "Manage",
    title: "Track every shift in one dashboard.",
    body: "Active, confirmed, archived. Settle in 48 hours, doctor keeps 100%.",
    src: "/screens/stathospital-dashboard.png",
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

function HowItWorks() {
  const stickyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stickyRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="how" className="relative bg-white">
      {/* Header, normal flow, scrolls past as the sticky stack pins below.
          Trim pb so the first sticky card sits close to the header
          instead of leaving a tall gap before the stack starts. */}
      <div className="relative max-w-[1100px] mx-auto px-6 pt-16 md:pt-24 pb-4 md:pb-6 text-center">
        <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">
          How it works
        </div>
        <h2 className="display text-[clamp(28px,4.5vw,56px)] leading-[1.0]">
          From post to confirmed{" "}
          <span className="italic text-ocean">in under 24 hours</span>.
        </h2>
        <p className="mt-4 text-muted max-w-xl mx-auto text-[14px] md:text-[15px] leading-relaxed">
          Four steps.{" "}
          <span className="hidden md:inline">Cards stack as you scroll.</span>
        </p>
      </div>

      {/* DESKTOP: sticky scroll-pinned card stack, height = N × 100vh */}
      <div
        ref={stickyRef}
        style={{ height: `${STEPS.length * 100}vh` }}
        className="relative hidden md:block"
      >
        {/* Anchor the card stack near the top of the viewport (with
            padding for the fixed navbar) instead of vertically centring
            it. items-center inside a 100vh sticky region pushed the
            560px card down by ~170px on tall screens, which read as a
            big empty band between the header and the first card.
            Height is sized to the card + nav clearance (not h-screen)
            so there's no empty bottom band when the sticky releases
            into the next section. */}
        <div className="sticky top-0 h-[660px] md:h-[680px] flex items-start pt-24 overflow-hidden px-4 md:px-6">
          <div className="relative w-full max-w-[1100px] mx-auto h-[520px] md:h-[560px]">
            {STEPS.map((step, i) => (
              <StackedCard
                key={step.n}
                step={step}
                index={i}
                total={STEPS.length}
                progress={scrollYProgress}
              />
            ))}
            <ProgressDots progress={scrollYProgress} total={STEPS.length} />
          </div>
        </div>
      </div>

      {/* MOBILE: simple vertical card stack, no sticky/scroll mechanics */}
      <div className="md:hidden px-4 pb-8 space-y-4">
        {STEPS.map((step, i) => (
          <MobileStepCard key={step.n} step={step} index={i} />
        ))}
      </div>
    </section>
  );
}

function MobileStepCard({ step, index }: { step: Step; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: 0.05 + index * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative rounded-3xl bg-lavender border border-ocean/15 overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-32 h-48 blur-3xl opacity-50"
        style={{ background: ACCENT_GLOW[step.accent] }}
      />
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-3">
          <div className={`display text-[28px] leading-none ${ACCENT_NUM[step.accent]}`}>
            {step.n}
          </div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-ink/10">
            <span className={`w-1.5 h-1.5 rounded-full ${ACCENT_DOT[step.accent]}`} />
            <span className="text-[9px] tracking-[0.22em] uppercase font-semibold text-ink">
              {step.pill}
            </span>
          </span>
        </div>
        <h3 className="display text-[20px] leading-[1.15] text-ink">
          {step.title}
        </h3>
        <p className="mt-2 text-[13px] text-ink/65 leading-relaxed">
          {step.body}
        </p>
      </div>
      <div className="relative px-4 pb-4">
        <div className="rounded-2xl bg-white border border-ink/12 shadow-[0_15px_40px_-20px_rgba(26,26,46,0.3)] overflow-hidden">
          <div className="flex items-center gap-1.5 px-3 h-5 bg-bone border-b border-ink/8">
            <span className="w-1.5 h-1.5 rounded-full bg-stat/55" />
            <span className="w-1.5 h-1.5 rounded-full bg-electric/80" />
            <span className="w-1.5 h-1.5 rounded-full bg-leaf/55" />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={step.src}
            alt={step.title}
            loading="lazy"
            decoding="async"
            className="w-full h-auto block"
          />
        </div>
      </div>
    </motion.div>
  );
}

function StackedCard({
  step,
  index,
  total,
  progress,
}: {
  step: Step;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const slot = 1 / total;
  const transition = slot * 0.45;

  // Build keyframes: card enters from below at its slot start, then each
  // subsequent card pushes it up + scales it down + dims it.
  const inputs: number[] = [];
  const ys: number[] = [];
  const opacities: number[] = [];
  const scales: number[] = [];

  if (index === 0) {
    // Card 0 starts visible and centred at progress 0.
    inputs.push(0);
    ys.push(0);
    opacities.push(1);
    scales.push(1);
  } else {
    const enterEnd = index * slot;
    const enterStart = Math.max(0, enterEnd - transition);
    inputs.push(enterStart, enterEnd);
    ys.push(260, 0);
    opacities.push(0, 1);
    scales.push(0.94, 1);
  }

  for (let j = index + 1; j < total; j++) {
    const pushEnd = j * slot;
    const pushStart = Math.max(
      inputs[inputs.length - 1] + 1e-4,
      pushEnd - transition
    );
    const depth = j - index;
    if (pushStart > inputs[inputs.length - 1]) {
      inputs.push(pushStart);
      ys.push(ys[ys.length - 1]);
      opacities.push(opacities[opacities.length - 1]);
      scales.push(scales[scales.length - 1]);
    }
    inputs.push(pushEnd);
    ys.push(-depth * 26);
    opacities.push(Math.max(0.4, 1 - depth * 0.18));
    scales.push(1 - depth * 0.04);
  }

  const y = useTransform(progress, inputs, ys);
  const opacity = useTransform(progress, inputs, opacities);
  const scale = useTransform(progress, inputs, scales);

  return (
    <motion.div
      style={{ y, opacity, scale, zIndex: index + 1 }}
      className="absolute inset-0"
    >
      <CardContent step={step} />
    </motion.div>
  );
}

function CardContent({ step }: { step: Step }) {
  return (
    <div className="relative w-full h-full rounded-[28px] bg-lavender border border-ocean/15 shadow-[0_50px_120px_-20px_rgba(50,50,255,0.25)] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-40 h-72 blur-3xl opacity-60"
        style={{ background: ACCENT_GLOW[step.accent] }}
      />

      <div className="relative w-full h-full grid grid-cols-1 md:grid-cols-[2fr_3fr]">
        {/* LEFT, text block */}
        <div className="p-7 md:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div
                className={`display text-[36px] md:text-[56px] leading-none ${ACCENT_NUM[step.accent]}`}
              >
                {step.n}
              </div>
              <span
                className={`w-2.5 h-2.5 rounded-full ${ACCENT_DOT[step.accent]}`}
              />
            </div>
            <h3 className="display text-[clamp(22px,2.6vw,34px)] leading-[1.05] text-ink">
              {step.title}
            </h3>
            <p className="mt-3 md:mt-4 text-[14px] md:text-[15px] text-ink/65 leading-relaxed max-w-sm">
              {step.body}
            </p>
          </div>
          <div className="hidden md:inline-flex items-center gap-2 mt-6 px-3 py-1.5 rounded-full bg-white border border-ink/10 self-start">
            <span className={`w-1.5 h-1.5 rounded-full ${ACCENT_DOT[step.accent]}`} />
            <span className="text-[10px] tracking-[0.22em] uppercase font-semibold text-ink">
              {step.pill}
            </span>
          </div>
        </div>

        {/* RIGHT, screenshot in browser frame, fills the area */}
        <div className="relative bg-ink/5 p-4 md:p-6 lg:p-8 flex items-center justify-center">
          <div className="relative w-full rounded-2xl bg-white border border-ink/12 shadow-[0_30px_70px_-25px_rgba(26,26,46,0.4)] overflow-hidden">
            <div className="flex items-center gap-1.5 px-3 h-6 bg-bone border-b border-ink/8">
              <span className="w-1.5 h-1.5 rounded-full bg-stat/55" />
              <span className="w-1.5 h-1.5 rounded-full bg-electric/80" />
              <span className="w-1.5 h-1.5 rounded-full bg-leaf/55" />
            </div>
            <div className="relative bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={step.src}
                alt={step.title}
                loading="lazy"
                decoding="async"
                className="w-full h-auto block"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressDots({
  progress,
  total,
}: {
  progress: MotionValue<number>;
  total: number;
}) {
  return (
    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-ink/10 shadow-[0_15px_30px_-10px_rgba(26,26,46,0.2)]">
      {Array.from({ length: total }).map((_, i) => (
        <ProgressDot key={i} index={i} total={total} progress={progress} />
      ))}
    </div>
  );
}

function ProgressDot({
  index,
  total,
  progress,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const slot = 1 / total;
  const start = Math.max(0, index * slot - slot * 0.4);
  const end = index * slot + slot * 0.4;
  const opacity = useTransform(progress, [start, end], [0.25, 1]);
  const scale = useTransform(progress, [start, end], [1, 1.4]);
  return (
    <motion.span
      style={{ opacity, scale }}
      className="w-2 h-2 rounded-full bg-ink"
    />
  );
}

/* ---------- HOSPITAL DEMO VIDEO ---------- */
function HospitalDemoVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !videoRef.current) return;
    const v = videoRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.4) {
            v.play().then(() => setPlaying(true)).catch(() => {});
          } else {
            v.pause();
            setPlaying(false);
          }
        });
      },
      { threshold: [0, 0.4, 0.6] },
    );
    io.observe(containerRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative bg-white pt-6 pb-14 md:pt-10 md:pb-20 px-4 md:px-6">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-2">
            See it in action
          </div>
          <h2 className="display text-[clamp(24px,3.6vw,44px)] leading-[1.0]">
            StatHospital, <span className="italic text-ocean">end to end</span>.
          </h2>
        </motion.div>

        <div ref={containerRef} className="relative max-w-[900px] mx-auto">
          <div
            aria-hidden
            className="absolute -inset-4 md:-inset-6 rounded-[34px] -z-10"
            style={{
              background:
                "linear-gradient(135deg, rgba(50,50,255,0.35), rgba(205,227,93,0.45))",
              filter: "blur(28px)",
              opacity: 0.5,
            }}
          />
          <div className="relative rounded-[24px] md:rounded-[28px] overflow-hidden border-2 border-ocean/40 shadow-[0_40px_120px_-30px_rgba(50,50,255,0.45)] bg-ink">
            <video
              ref={videoRef}
              className="block w-full h-auto"
              src="/stathospital-video.mp4"
              poster="/stathospital-video-poster.jpg"
              muted={muted}
              loop
              playsInline
              preload="metadata"
            />
            <button
              onClick={() => {
                if (!videoRef.current) return;
                const next = !muted;
                videoRef.current.muted = next;
                setMuted(next);
                if (!playing) videoRef.current.play().catch(() => {});
              }}
              className="absolute bottom-4 right-4 md:bottom-5 md:right-5 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-ink/10 text-xs font-medium text-ink hover:bg-white transition-colors flex items-center gap-2"
              data-hover
            >
              <span className="block w-1.5 h-1.5 rounded-full bg-electric" />
              {muted ? "Tap for sound" : "Sound on"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- COMPARISON ---------- */
const COMPARE: { dim: string; agency: string; sd: string }[] = [
  { dim: "Agency fee", agency: "15-25%", sd: "0%" },
  { dim: "Time to fill", agency: "2-10 days", sd: "2-48 hours" },
  { dim: "Credential check", agency: "Manual, ongoing", sd: "Continuous & automated" },
  { dim: "Doctor quality control", agency: "Agency-mediated", sd: "Direct ratings & reviews" },
  { dim: "Payment", agency: "Via agency", sd: "Direct, 48 hours" },
];

function Comparison() {
  return (
    <section className="relative bg-ink text-bone py-20 md:py-24 px-6 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(50% 50% at 80% 20%, rgba(50,50,255,0.45), transparent 70%), radial-gradient(40% 40% at 15% 80%, rgba(205,227,93,0.20), transparent 70%)",
        }}
      />
      <div className="relative max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-14"
        >
          <div className="text-[10px] tracking-[0.22em] uppercase text-bone/60 mb-3">
            Agency vs StatDoctor
          </div>
          <h2 className="display text-[clamp(28px,4.5vw,56px)] leading-[1.0] text-bone">
            The math <span className="italic text-electric">just works</span>.
          </h2>
        </motion.div>

        {/* DESKTOP table */}
        <div className="hidden sm:block rounded-3xl overflow-hidden border border-bone/15 bg-bone/5 backdrop-blur-sm">
          <div className="grid grid-cols-3 bg-bone/10 text-bone text-[10px] tracking-[0.22em] uppercase">
            <div className="px-5 py-4 font-semibold">Dimension</div>
            <div className="px-5 py-4 opacity-60">Traditional agency</div>
            <div className="px-5 py-4 text-electric font-semibold">StatDoctor</div>
          </div>
          {COMPARE.map((row, i) => (
            <motion.div
              key={row.dim}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="grid grid-cols-3 border-t border-bone/10"
            >
              <div className="px-5 py-4 text-[14px] text-bone">{row.dim}</div>
              <div className="px-5 py-4 text-[14px] text-bone/55 line-through decoration-stat/60">
                {row.agency}
              </div>
              <div className="px-5 py-4 text-[14px] text-electric font-medium">
                {row.sd}
              </div>
            </motion.div>
          ))}
        </div>

        {/* MOBILE cards, one per row */}
        <div className="sm:hidden flex flex-col gap-3">
          {COMPARE.map((row, i) => (
            <motion.div
              key={row.dim}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="rounded-2xl border border-bone/15 bg-bone/5 p-4"
            >
              <div className="text-[10px] tracking-[0.22em] uppercase text-bone/70 font-semibold mb-3">
                {row.dim}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[9px] tracking-[0.18em] uppercase text-bone/45 mb-1">
                    Agency
                  </div>
                  <div className="text-[13px] text-bone/55 line-through decoration-stat/60">
                    {row.agency}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] tracking-[0.18em] uppercase text-electric/80 mb-1">
                    StatDoctor
                  </div>
                  <div className="text-[13px] text-electric font-medium">
                    {row.sd}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- PRICING ---------- */
function Pricing({ onContact }: { onContact: () => void }) {
  return (
    <section className="relative bg-white py-20 md:py-24 px-6">
      <div className="relative max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-14"
        >
          <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">
            Pricing
          </div>
          <h2 className="display text-[clamp(28px,4.5vw,56px)] leading-[1.0]">
            Flat annual pricing.{" "}
            <span className="italic text-ocean">No per-shift fees</span>.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative rounded-3xl bg-lavender border border-ocean/10 p-7 md:p-8 flex flex-col"
          >
            <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">
              Single hospital
            </div>
            <div className="text-[11px] md:text-[12px] text-muted mb-1">
              Starting from
            </div>
            <div className="display text-[clamp(48px,5vw,64px)] leading-none">
              $10K
              <span className="text-base text-muted ml-1">/year</span>
            </div>
            <p className="mt-3 text-[13px] md:text-[14px] text-muted leading-relaxed">
              Unlimited access for one hospital. Locum shifts, permanent
              hiring, and locum-to-permanent conversion all included, no
              per-shift fees, no buy-out fees.
            </p>
            <ul className="mt-5 space-y-2.5 text-[13px] md:text-[14px] text-ink/85 flex-1">
              <Bullet>Unlimited doctors & shifts</Bullet>
              <Bullet>Permanent hiring included</Bullet>
              <Bullet>Locum-to-permanent at $0 extra</Bullet>
              <Bullet>Verified, AHPRA-checked doctors</Bullet>
            </ul>
            <button
              onClick={onContact}
              className="mt-6 inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full bg-ocean text-white text-sm font-semibold hover:bg-ink transition-colors"
              data-hover
            >
              Get started
              <span aria-hidden>→</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative rounded-3xl bg-ink text-bone border border-bone/10 p-7 md:p-8 flex flex-col"
          >
            <div className="text-[10px] tracking-[0.22em] uppercase text-bone/60 mb-3">
              Health service · State service
            </div>
            <div className="text-[11px] md:text-[12px] text-bone/60 mb-1">
              Starting from
            </div>
            <div className="display text-[clamp(48px,5vw,64px)] leading-none">
              $50K
              <span className="text-base text-bone/60 ml-1">/year</span>
            </div>
            <p className="mt-3 text-[13px] md:text-[14px] text-bone/70 leading-relaxed">
              Manage up to 10 hospitals through a single admin account.
              Everything in the single-hospital plan, applied across your
              entire network.
            </p>
            <ul className="mt-5 space-y-2.5 text-[13px] md:text-[14px] text-bone/85 flex-1">
              <Bullet dark>Up to 10 hospitals</Bullet>
              <Bullet dark>One admin account, all sites</Bullet>
              <Bullet dark>Unlimited doctors & shifts</Bullet>
              <Bullet dark>Locum-to-permanent at $0 extra</Bullet>
            </ul>
            <button
              onClick={onContact}
              className="mt-6 inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full bg-electric text-ink text-sm font-semibold hover:bg-bone transition-colors"
              data-hover
            >
              Talk to sales
              <span aria-hidden>→</span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Bullet({
  children,
  dark,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
          dark ? "bg-electric" : "bg-ocean"
        }`}
      />
      <span>{children}</span>
    </li>
  );
}

/* ---------- PERMANENT-HIRE VALUE PROP ----------
   Hospitals routinely meet a locum they'd like to hire permanently —
   on most agencies that triggers a buy-out fee (often 20–25% of first-
   year salary). StatDoctor doesn't charge anything to convert. This
   callout makes that visible right after pricing so admins reading
   the page see it before they reach the FAQ. */
function PermHireCallout({ onContact }: { onContact: () => void }) {
  return (
    <section className="relative bg-white py-10 md:py-14 px-6">
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative overflow-hidden rounded-3xl border border-ocean/15 bg-lavender p-7 md:p-10"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-40"
            style={{
              background:
                "radial-gradient(50% 60% at 80% 50%, rgba(50,50,255,0.30), transparent 70%)",
            }}
          />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-10">
            <div className="md:max-w-2xl">
              <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-2">
                No buy-out fees, ever
              </div>
              <h3 className="display text-[clamp(22px,3vw,36px)] leading-[1.1] text-ink">
                Like a locum? Hire them permanently{" "}
                <span className="italic text-ocean">
                  at no extra cost
                </span>
                .
              </h3>
              <p className="mt-3 text-[14px] md:text-[15px] text-ink/70 leading-relaxed max-w-xl">
                Agencies charge 15-25% of first-year salary to convert a locum
                to a permanent hire. We charge $0. If a hospital and a doctor
                want to make it permanent, that&apos;s between you and them.
                We&apos;re not in the middle.
              </p>
            </div>
            <button
              onClick={onContact}
              className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-ocean text-white text-sm font-semibold hover:bg-ink transition-colors"
              data-hover
            >
              Talk to us
              <span aria-hidden>→</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
const HOSPITAL_FAQ: { q: string; a: string }[] = [
  {
    q: "Is there an onboarding fee?",
    a: "No. You can post your first shift within 30 minutes of creating an account.",
  },
  {
    q: "How are doctors verified?",
    a: "Every doctor uploads AHPRA registration, indemnity, and CV. We verify on signup and refresh checks continuously. You see verification status on every applicant.",
  },
  {
    q: "What's the platform fee, exactly?",
    a: "Flat annual pricing, starting from $10K/year for a single hospital, with unlimited shifts, unlimited doctors, and locum and permanent hiring all included. Starting from $50K/year for health services or state services managing up to 10 hospitals through a single admin account. No per-shift fees, no buy-out fees, no per-seat charges.",
  },
  {
    q: "Can we set a maximum hourly rate?",
    a: "Yes. You set the rate when posting. Doctors apply or don't. Most rural and out-of-hours shifts are accepted within an hour at the posted rate.",
  },
  {
    q: "How fast can a shift be filled?",
    a: "Median fill time is under 24 hours. Same-day urgent shifts are typically filled in 30 minutes to a few hours, depending on specialty and location.",
  },
  {
    q: "Can we hire one of the doctors permanently?",
    a: "Yes, at no extra cost. Most agencies charge 15-25% of first-year salary as a buy-out fee when a locum converts to a permanent hire. We charge $0. If a hospital and doctor want to formalise a permanent role, that's between you and them.",
  },
];

function HospitalFAQ() {
  return (
    <section className="relative bg-white py-20 md:py-24 px-6">
      <div className="relative max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-12"
        >
          <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">
            FAQ
          </div>
          <h2 className="display text-[clamp(28px,4.5vw,56px)] leading-[1.0]">
            What hospital admins{" "}
            <span className="italic text-ocean">ask first</span>.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 items-start">
          {HOSPITAL_FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl bg-white border border-ink/10 hover:border-ink/20 transition-colors open:bg-bone open:border-ink/15"
            >
              <summary className="cursor-pointer flex items-center justify-between gap-4 px-5 py-4 md:px-6 md:py-5 list-none [&::-webkit-details-marker]:hidden">
                <span className="display text-[16px] md:text-[18px] leading-[1.25]">
                  {item.q}
                </span>
                <span className="shrink-0 w-7 h-7 grid place-items-center rounded-full border border-ink/15 transition-transform group-open:rotate-45 group-open:bg-ink group-open:text-white group-open:border-ink">
                  +
                </span>
              </summary>
              <p className="px-5 md:px-6 pb-5 md:pb-6 text-sm md:text-[15px] text-muted leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CLOSING CTA ---------- */
function ClosingCTA({ onContact }: { onContact: () => void }) {
  return (
    <section className="relative bg-white">
      <div className="relative max-w-[1100px] mx-auto px-6 py-14 md:py-16 text-center">
        <h2 className="display text-[clamp(28px,4.5vw,56px)] leading-[1.0] max-w-3xl mx-auto">
          Stop paying the{" "}
          <span className="italic text-ocean">agency tax</span>.
        </h2>
        <p className="mt-4 text-muted max-w-xl mx-auto text-[14px] md:text-[15px] leading-relaxed">
          15 minutes with our team. Zero commitment. We&apos;ll show you a live
          shift dashboard with your data by the end of the week.
        </p>
        <button
          onClick={onContact}
          className="mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-white text-sm font-semibold hover:bg-ocean transition-colors"
          data-hover
        >
          Book a demo
          <span aria-hidden>→</span>
        </button>
      </div>
    </section>
  );
}
