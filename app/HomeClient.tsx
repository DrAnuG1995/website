"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import SplitText from "@/components/SplitText";
import MagneticButton from "@/components/MagneticButton";
import VideoSlot from "@/components/VideoSlot";
import Counter from "@/components/Counter";

/* =========================================================
   HOMEPAGE — 5 Chapters
   00 Cold Open · 01 Founder · 02 Reckoning · 03 Product · 04 Doctors · 05 Invitation
   ========================================================= */

const SHIFTS = [
  { specialty: "ED Registrar", place: "Royal Melbourne", meta: "Tonight · 8h", rate: "$145/hr" },
  { specialty: "GP Locum", place: "Bendigo Health", meta: "Sat · 10h", rate: "$180/hr" },
  { specialty: "Anaesthetics", place: "St Vincent's Sydney", meta: "Mon · 12h", rate: "$210/hr" },
  { specialty: "Paediatrics", place: "Queensland Children's", meta: "Fri · 8h", rate: "$165/hr" },
  { specialty: "Psychiatry", place: "Cairns Base", meta: "Wed · 6h", rate: "$190/hr" },
  { specialty: "Surgical Reg", place: "Geelong Hospital", meta: "Thu · 10h", rate: "$175/hr" },
  { specialty: "ICU Fellow", place: "Royal Perth", meta: "Sun · 12h", rate: "$225/hr" },
  { specialty: "Obstetrics", place: "Mater Brisbane", meta: "Tue · 10h", rate: "$200/hr" },
  { specialty: "ED SHO", place: "Box Hill Hospital", meta: "Fri · 10h", rate: "$155/hr" },
  { specialty: "General Med", place: "Alfred Hospital", meta: "Sat · 8h", rate: "$150/hr" },
];

const DOCTORS = [
  {
    name: "Dr Layth Samari",
    credential: "MD · ACEM Trainee",
    city: "Melbourne",
    img: "/doctors/dr-layth.png",
    quote: "A great initiative to help doctors be in charge of their own work-life balance with the ease of picking up shifts on demand.",
    body:
      "Layth has been a StatDoctor user for 14 months. He covers weekend ED shifts across regional Victoria, splitting time between his ACEM training program and locum work on his own terms.",
  },
  {
    name: "Dr Priya Shah",
    credential: "MD · GP Fellow",
    city: "Sydney",
    img: "/doctors/dr-priya.png",
    quote: "StatDoctor enables me to see available shifts on my own terms. No annoying phone calls from managing reps.",
    body:
      "Priya booked her first shift within 48 hours of signing up. She uses the app to supplement her salaried GP role with higher-paying locum shifts across metropolitan Sydney — without ever speaking to an agency.",
  },
  {
    name: "Dr David Burton",
    credential: "MD · Emergency Medicine",
    city: "Brisbane",
    img: "/doctors/dr-david.png",
    quote: "Easy and clear to use. I've been able to communicate my shifts and availability efficiently with multiple hospitals.",
    body:
      "David works with four different Queensland hospitals through StatDoctor. He estimates the platform has saved him roughly eight hours a week previously spent on agency phone calls and paperwork.",
  },
];

const LOGOS = [
  "https://cdn.prod.website-files.com/688db6d677516719c3925d01/69891c5f64ac3ee08b11eea1_1.png",
  "https://cdn.prod.website-files.com/688db6d677516719c3925d01/69a79f6b34e627a6c618835f_16.png",
  "https://cdn.prod.website-files.com/688db6d677516719c3925d01/6891b90e4261c120b064cabc_Group%201799.svg",
  "https://cdn.prod.website-files.com/688db6d677516719c3925d01/6891b2ca97d3296f92eecdb3_Group%201797.svg",
  "https://cdn.prod.website-files.com/688db6d677516719c3925d01/6891b9bdc8ce83d0d774d6a0_Group%201795.svg",
  "https://cdn.prod.website-files.com/688db6d677516719c3925d01/6989187d91bc7a590978853b_Hospital%20Logos%20(100%20x%20100%20px).png",
  "https://cdn.prod.website-files.com/688db6d677516719c3925d01/69891c60a412a0902b515580_3.png",
  "https://cdn.prod.website-files.com/688db6d677516719c3925d01/69891c6022354c21182e964e_5.png",
  "https://cdn.prod.website-files.com/688db6d677516719c3925d01/697c24083cb29d7af761cd8f_brhs.png",
  "https://cdn.prod.website-files.com/688db6d677516719c3925d01/697c31849389b03bf00674df_Myfast%20medical%20Logo.png",
  "https://cdn.prod.website-files.com/688db6d677516719c3925d01/69a79f6bd66a38e7ecd9a248_17.png",
  "https://cdn.prod.website-files.com/688db6d677516719c3925d01/69a79f6b8e767399e5f8ad70_4.png",
];

export default function HomeClient() {
  return (
    <>
      <ChapterCold />
      <ChapterFounder />
      <ChapterReckoning />
      <ChapterProduct />
      <LiveTicker />
      <TrustLogos />
      <ChapterDoctors />
      <Numbers />
      <ChapterInvitation />
    </>
  );
}

/* ============ CHAPTER 00 — COLD OPEN ============ */
function ChapterCold() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 2800);
    return () => clearTimeout(t1);
  }, []);

  return (
    <section className="min-h-screen grid place-items-center relative pt-32 pb-20 px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute top-28 left-1/2 -translate-x-1/2 mono text-[10px] tracking-[0.3em] text-muted"
      >
        CHAPTER 00 · COLD OPEN
      </motion.div>

      <div className="max-w-5xl text-center">
        <AnimatePresence mode="wait">
          {phase === 0 ? (
            <motion.h1
              key="a"
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="display text-[clamp(40px,7vw,112px)]"
            >
              <SplitText stagger={0.028}>It&apos;s 2:04am. Your phone buzzes.</SplitText>
              <br />
              <SplitText stagger={0.028} start={1.2} className="italic text-ocean">
                Another agency shift.
              </SplitText>
              <span className="inline-block w-1 h-[0.85em] bg-ink align-baseline animate-blink ml-1 translate-y-1.5" />
            </motion.h1>
          ) : (
            <motion.h1
              key="b"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
              className="display text-[clamp(40px,7vw,112px)]"
              data-mascot="Welcome. Scroll down — the founder has something to say first."
            >
              We built a <em className="italic text-ocean">better</em> way.
              <br />
              <span className="text-muted italic text-[0.55em] font-sans not-italic tracking-normal mt-8 block">
                For doctors. By doctors.
              </span>
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 1 ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 mono text-[10px] tracking-[0.3em] text-muted"
      >
        <span className="w-px h-10 bg-muted/40 overflow-hidden relative">
          <span className="absolute inset-0 bg-ink animate-[slideDown_2s_ease-in-out_infinite]" />
        </span>
        CONTINUE READING
      </motion.div>
      <style jsx>{`
        @keyframes slideDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </section>
  );
}

/* ============ CHAPTER 01 — FOUNDER ============ */
function ChapterFounder() {
  return (
    <section
      id="founder"
      className="py-32 px-6 bg-bone-2 border-y border-ink/10 relative"
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="grid md:grid-cols-[280px_1fr] gap-12 md:gap-16">
          <div className="md:sticky md:top-32 md:self-start">
            <div className="eyebrow mb-4">Chapter 01</div>
            <h3 className="display text-4xl mb-8 leading-[1.05]">
              A message from <em className="italic text-ocean">our founder</em>.
            </h3>
            <ul className="border-t border-ink/15 mono text-xs">
              {[
                ["00:00", "Why I built StatDoctor"],
                ["00:22", "What agencies cost you"],
                ["00:48", "How doctors keep 100%"],
                ["01:15", "What hospitals get"],
              ].map(([t, label]) => (
                <li
                  key={t}
                  className="flex justify-between py-3.5 border-b border-ink/15 hover:text-ink text-muted transition-colors cursor-pointer"
                  data-hover
                >
                  <span>{label}</span>
                  <span className="tracking-widest">{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 text-sm text-muted">
              Captions on by default.
              <br />
              Press the play pill for the full 90-second message.
            </div>
          </div>

          <div data-mascot="This is where our CEO speaks directly to you. Drop your video in — it's ready.">
            <VideoSlot />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ CHAPTER 02 — THE RECKONING (scroll-driven, pinned) ============ */
function ChapterReckoning() {
  const ref = useRef<HTMLDivElement>(null);
  // Section is 300vh tall with a 100vh sticky inside → sticky is engaged for scroll
  // from section_top to section_top + 200vh, which maps exactly to useScroll progress 0→1.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // 3 beats, NO overlap between them — one clean fade at a time.
  //   Beat A — The number     (0.00 – 0.33)
  //   Beat B — The breakdown  (0.33 – 0.66)  (slice fly-off mid-beat at 0.44–0.58)
  //   Beat C — The punchline  (0.66 – 1.00)
  const aOpacity = useTransform(scrollYProgress, [0, 0.04, 0.30, 0.34], [0, 1, 1, 0]);
  const aY       = useTransform(scrollYProgress, [0, 0.04, 0.30, 0.34], [16, 0, 0, -16]);

  const bOpacity = useTransform(scrollYProgress, [0.34, 0.38, 0.62, 0.66], [0, 1, 1, 0]);
  const bY       = useTransform(scrollYProgress, [0.34, 0.38, 0.62, 0.66], [16, 0, 0, -16]);

  // Slice fly-off happens mid-Beat-B.
  const sliceX     = useTransform(scrollYProgress, [0.44, 0.58], [0, 520]);
  const sliceRot   = useTransform(scrollYProgress, [0.44, 0.58], [0, 35]);
  const sliceOp    = useTransform(scrollYProgress, [0.44, 0.52, 0.6], [1, 1, 0]);
  const labelOp    = useTransform(scrollYProgress, [0.44, 0.56], [1, 0]);

  const cOpacity = useTransform(scrollYProgress, [0.66, 0.72], [0, 1]);
  const cY       = useTransform(scrollYProgress, [0.66, 0.72], [16, 0]);

  // Progress dots
  const [dot, setDot] = useState(0);
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      if (v < 0.34) setDot(0);
      else if (v < 0.66) setDot(1);
      else setDot(2);
    });
    return () => unsub();
  }, [scrollYProgress]);

  return (
    <section
      ref={ref}
      className="bg-ink text-bone relative"
      style={{ height: "300vh" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 500px at 20% 20%, rgba(50,50,255,0.15), transparent 60%), radial-gradient(700px 500px at 80% 80%, rgba(205,227,93,0.08), transparent 60%)",
        }}
      />

      {/* Sticky viewport — stays pinned for the whole 300vh while beats scroll through */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Persistent chapter label — always visible at top of viewport */}
        <div className="absolute top-0 inset-x-0 pt-28 pb-4 text-center z-10 pointer-events-none">
          <div className="eyebrow text-stat">Chapter 02 · The Reckoning</div>
        </div>

        {/* Beat stage — each beat fills the full viewport and is centered */}
        <div className="absolute inset-0">
          {/* === Beat A — the number === */}
          <motion.div
            style={{ opacity: aOpacity, y: aY }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          >
            <div
              className="display text-[clamp(72px,15vw,220px)] leading-[0.95] tabular-nums"
              data-mascot="Agencies skim ~20% off every shift. That's billions a year, out of doctors' pockets."
            >
              <span className="text-stat">$</span>
              <Counter to={1.4} decimals={1} duration={1.6} />
              <span className="text-stat text-[0.5em] align-top ml-1">B</span>
            </div>
            <p className="display italic text-2xl md:text-[34px] max-w-2xl mt-8 leading-[1.2] opacity-80">
              Australian doctor wages quietly diverted to agencies each year.
            </p>
          </motion.div>

          {/* === Beat B — the breakdown === */}
          <motion.div
            style={{ opacity: bOpacity, y: bY }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          >
            <div className="eyebrow text-stat mb-6">THE AGENCY TAX</div>
            <p className="display italic text-[clamp(28px,4.2vw,52px)] max-w-3xl leading-[1.15] opacity-90">
              For every shift, agencies quietly
              <br />
              skim <em className="not-italic text-stat font-semibold">20%</em> off the top.
            </p>

            <div className="relative w-full max-w-2xl mt-14">
              <svg viewBox="0 0 800 80" className="w-full h-auto">
                <defs>
                  <linearGradient id="reckoning-grad" x1="0" x2="1">
                    <stop offset="0%" stopColor="#cde35d" />
                    <stop offset="100%" stopColor="#3232ff" />
                  </linearGradient>
                </defs>
                <rect x="0" y="20" width="800" height="40" rx="20" fill="url(#reckoning-grad)" opacity="0.25" />
                <rect x="0" y="20" width="640" height="40" rx="20" fill="url(#reckoning-grad)" />
                <motion.rect
                  x="640"
                  y="20"
                  width="160"
                  height="40"
                  rx="20"
                  fill="#FF5A36"
                  style={{ x: sliceX, rotate: sliceRot, opacity: sliceOp, originX: "50%", originY: "50%" }}
                />
              </svg>
              <div className="flex justify-between mono text-[10px] tracking-widest text-parchment mt-4">
                <span>DOCTOR WAGES · 100%</span>
                <motion.span style={{ opacity: labelOp }} className="text-stat">
                  AGENCY CUT · 20% →
                </motion.span>
              </div>
            </div>
          </motion.div>

          {/* === Beat C — the punchline === */}
          <motion.div
            style={{ opacity: cOpacity, y: cY }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          >
            <div className="eyebrow text-electric mb-6">THE AGENCY TAX ENDS HERE</div>
            <h2 className="display text-[clamp(40px,7vw,96px)] leading-[0.98] mb-10 max-w-4xl">
              StatDoctor takes <em className="italic text-electric">0%</em>.
              <br />
              Doctors keep <em className="italic text-electric">100%</em>.
            </h2>
            <div className="mono text-xs tracking-widest text-parchment">
              NO AGENCY · NO MIDDLEMAN · NO HIDDEN FEES
            </div>
          </motion.div>
        </div>

        {/* Bottom strip — progress dots + scroll hint */}
        <div className="absolute bottom-10 inset-x-0 flex flex-col items-center gap-4 z-10">
          <div className="flex items-center gap-2 mono text-[10px] tracking-widest text-parchment">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[2px] rounded-full transition-all duration-500"
                style={{
                  width: dot === i ? 40 : 14,
                  background: dot >= i ? "#cde35d" : "rgba(245,241,232,0.25)",
                }}
              />
            ))}
            <span className="ml-3">{String(dot + 1).padStart(2, "0")} / 03</span>
          </div>

          <motion.div
            style={{ opacity: aOpacity }}
            className="mono text-[10px] tracking-[0.3em] text-parchment/60 flex flex-col items-center gap-2"
          >
            <span>KEEP SCROLLING</span>
            <span className="inline-block w-px h-6 bg-parchment/30 overflow-hidden relative">
              <span className="absolute inset-0 bg-electric animate-[slideDownReck_1.8s_ease-in-out_infinite]" />
            </span>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDownReck {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </section>
  );
}

/* ============ CHAPTER 03 — PRODUCT TOUR (pinned, scrubbed) ============ */
function ChapterProduct() {
  const ref = useRef<HTMLDivElement>(null);
  // Pin the entire tour inside the section.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);

  const steps = [
    { tag: "01", eyebrow: "DISCOVER", title: "See every shift in your state.", body: "Real-time feed of open shifts across Australia. Filter by specialty, rate, location, and date. No phone tag with agency reps.", color: "#cde35d", rates: [145, 160, 175, 190] },
    { tag: "02", eyebrow: "DETAILS", title: "Know your rate upfront.", body: "Every shift shows exactly what you'll earn before you apply. Break times, travel, penalty rates — no surprises, no negotiation loops.", color: "#7b7bf4", rates: [180, 200, 215, 225] },
    { tag: "03", eyebrow: "BOOKED", title: "Book in two taps.", body: "Upload your credentials once — AHPRA, insurance, CV. Apply with a single tap. Hospitals confirm instantly.", color: "#3232ff", rates: [165, 185, 195, 210] },
    { tag: "04", eyebrow: "PAID", title: "Paid in 48 hours.", body: "Work your shift, get paid. No invoicing, no chasing finance departments, no 6-week agency waits.", color: "#1a1a2e", rates: [155, 170, 180, 200] },
  ];

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      // Map 0-1 progress across 4 steps. Give step 1 a buffer at the start.
      // 0-0.15 = intro (step 0 prep), 0.15-0.38 = step 0, 0.38-0.58 = step 1, 0.58-0.78 = step 2, 0.78-1.0 = step 3
      let s = 0;
      if (v < 0.15) s = 0;
      else if (v < 0.38) s = 0;
      else if (v < 0.58) s = 1;
      else if (v < 0.78) s = 2;
      else s = 3;
      setStep(s);
    });
    return () => unsub();
  }, [scrollYProgress]);

  const current = steps[step];

  return (
    <section
      ref={ref}
      className="bg-bone relative"
      // 4 steps × 100vh + 100vh intro/outro cushion = 500vh so each step has real scroll room
      style={{ height: "500vh" }}
      data-mascot="Here's the app. Scroll — I'll walk you through each screen."
    >
      <div className="sticky top-0 h-screen flex items-center px-6 overflow-hidden">
        <div className="max-w-[1280px] mx-auto w-full">
          {/* Header — centered in the viewport; fades out when tour begins */}
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0, 0.08, 0.15], [1, 1, 0]) }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          >
            <div className="max-w-3xl">
              <div className="eyebrow mb-3">Chapter 03 · The Product</div>
              <h2 className="display text-[clamp(40px,7vw,84px)] leading-[0.98]">
                Four screens. <em className="italic text-ocean">That&apos;s the whole app.</em>
              </h2>
              <p className="mt-5 text-base text-muted">Scroll slowly — each screen earns its keep.</p>
            </div>
          </motion.div>

          {/* Tour grid */}
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0.1, 0.2], [0, 1]) }}
            className="grid md:grid-cols-[1fr_340px_1fr] gap-10 items-center"
          >
            {/* Steps left */}
            <ul className="flex flex-col gap-3">
              {steps.map((s, i) => (
                <motion.li
                  key={i}
                  animate={{
                    borderColor: step === i ? "#1a1a2e" : "rgba(26,26,46,0.08)",
                    backgroundColor: step === i ? "#E8DFCB" : "rgba(232,223,203,0)",
                    x: step === i ? 8 : 0,
                    opacity: step === i ? 1 : 0.45,
                  }}
                  transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                  className="border rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="mono text-[10px] tracking-widest text-muted">STEP {s.tag}</div>
                    {step === i && (
                      <motion.span
                        layoutId="step-dot"
                        className="w-2 h-2 rounded-full"
                        style={{ background: s.color }}
                      />
                    )}
                  </div>
                  <h4 className="display text-xl mt-2 leading-tight">{s.title}</h4>
                  {step === i && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.4 }}
                      className="text-[13px] text-muted leading-relaxed mt-2 overflow-hidden"
                    >
                      {s.body}
                    </motion.p>
                  )}
                </motion.li>
              ))}
            </ul>

            {/* Phone — stays in place, screen crossfades */}
            <div className="relative mx-auto w-full max-w-[320px] aspect-[9/18.5] bg-ink rounded-[44px] p-3 shadow-[0_50px_90px_-30px_rgba(26,26,46,0.45)]">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-ink rounded-full z-20" />
              <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-bone">
                {steps.map((s, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: step === i ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(180deg, ${s.color} 0%, #F5F1E8 32%)`,
                      }}
                    />
                    <div className="relative p-4 pt-14 text-ink h-full">
                      <div className="mono text-[9px] tracking-widest opacity-70">
                        {`STEP ${s.tag} · ${s.eyebrow}`}
                      </div>
                      <div className="display text-xl mt-3 leading-tight pr-4">
                        {s.title.split(".")[0]}.
                      </div>
                      <div className="mt-5 space-y-2">
                        {s.rates.map((rate, k) => (
                          <motion.div
                            key={`${i}-${k}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={step === i ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                            transition={{ duration: 0.35, delay: step === i ? k * 0.08 : 0 }}
                            className="rounded-xl bg-bone-2 border border-ink/10 p-3"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="mono text-[9px] tracking-widest text-ocean">
                                  {["ED REG", "GP", "ANAES", "PSYCH"][k % 4]}
                                </div>
                                <div className="display text-sm mt-1">
                                  {["Royal Melb", "Bendigo", "St Vincent", "Mater"][k % 4]}
                                </div>
                              </div>
                              <div className="mono text-xs font-semibold">${rate}</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: step-specific callout card */}
            <div className="relative h-[380px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 p-6 bg-gauze rounded-3xl border border-ink/10 max-w-[320px]"
                >
                  <div className="mono text-[10px] tracking-widest text-muted">
                    {step === 0 && "AVAILABLE NOW"}
                    {step === 1 && "TRANSPARENT RATE"}
                    {step === 2 && "APPROVED IN 4 MIN"}
                    {step === 3 && "PAID OUT"}
                  </div>
                  <div className="display text-5xl mt-3">
                    ${current.rates[0]}
                    <span className="text-sm text-muted font-sans ml-1">/hr</span>
                  </div>
                  <div className="text-sm mt-3 font-medium">
                    {step === 0 && "ED Registrar · Tonight"}
                    {step === 1 && "GP Locum · Saturday"}
                    {step === 2 && "Anaesthetics · Monday"}
                    {step === 3 && "Paid Tuesday 8:30am"}
                  </div>
                  <div className="text-xs text-muted mt-1">
                    {step === 0 && "Royal Melbourne Hospital · 8h shift"}
                    {step === 1 && "Bendigo Health · 10h shift"}
                    {step === 2 && "St Vincent's Sydney · 12h shift"}
                    {step === 3 && "Cleared direct · no invoice"}
                  </div>
                  <div
                    className="inline-flex items-center gap-2 mt-5 px-3 py-1.5 rounded-full text-bone mono text-[10px] tracking-widest"
                    style={{ background: current.color, color: step === 3 ? "#cde35d" : "#1a1a2e" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-stat animate-pulse-dot" />
                    {step === 0 && "LIVE · 3 OTHERS VIEWING"}
                    {step === 1 && "YOUR RATE · CONFIRMED"}
                    {step === 2 && "BOOKED · CALENDAR UPDATED"}
                    {step === 3 && "CLEARED · IN YOUR ACCOUNT"}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0.1, 0.2], [0, 1]) }}
            className="absolute bottom-[8vh] left-1/2 -translate-x-1/2 flex items-center gap-2 mono text-[10px] tracking-widest text-muted"
          >
            {steps.map((_, i) => (
              <div
                key={i}
                className="h-[2px] rounded-full transition-all duration-500"
                style={{
                  width: step === i ? 48 : 20,
                  background: step >= i ? "#1a1a2e" : "rgba(26,26,46,0.2)",
                }}
              />
            ))}
            <span className="ml-3">
              {String(step + 1).padStart(2, "0")} / 04
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ============ LIVE TICKER ============ */
function LiveTicker() {
  const cards = [...SHIFTS, ...SHIFTS];
  return (
    <section className="py-20 px-6 bg-bone border-t border-ink/10" data-mascot="These are real shifts on the platform right now.">
      <div className="max-w-[1280px] mx-auto mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="eyebrow mb-2">Live Feed</div>
          <h3 className="display text-3xl md:text-5xl">Shifts booking <em className="italic text-ocean">right now</em>.</h3>
        </div>
        <div className="inline-flex items-center gap-2 mono text-xs text-muted">
          <span className="w-2 h-2 rounded-full bg-stat animate-pulse-dot" />
          UPDATING EVERY 60s
        </div>
      </div>

      <div className="marquee-mask">
        <div className="flex gap-4 w-max animate-marquee hover:[animation-play-state:paused]">
          {cards.map((s, i) => (
            <div
              key={i}
              className="w-[300px] shrink-0 p-5 bg-bone-2 border border-ink/10 rounded-2xl hover:border-ink hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              data-hover
            >
              <div className="mono text-[10px] tracking-widest text-ocean uppercase">{s.specialty}</div>
              <div className="display text-xl mt-2 leading-tight">{s.place}</div>
              <div className="flex justify-between items-baseline mt-2">
                <div className="text-sm text-muted">{s.meta}</div>
                <div className="mono text-sm font-semibold">{s.rate}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ TRUST LOGOS ============ */
function TrustLogos() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mono text-[11px] tracking-[0.2em] uppercase text-muted mb-8">
          Trusted by 60+ healthcare facilities across Australia
        </div>
        <div className="marquee-mask">
          <div className="flex gap-16 w-max animate-marquee-slow items-center">
            {[...LOGOS, ...LOGOS].map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt=""
                className="h-14 w-auto hover:scale-110 transition-transform duration-300"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ CHAPTER 04 — THE DOCTORS ============ */
function ChapterDoctors() {
  return (
    <section className="py-32 px-6 bg-bone-2 border-y border-ink/10">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="eyebrow">Chapter 04 · The Doctors</div>
          <h2 className="display text-[clamp(48px,8vw,96px)] leading-[0.98] mt-4">
            Real doctors. <em className="italic text-ocean">Real hours back.</em>
          </h2>
        </motion.div>

        {DOCTORS.map((d, i) => (
          <motion.article
            key={d.name}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "200px" }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            className={`grid md:grid-cols-[340px_1fr] gap-10 md:gap-20 items-start max-w-5xl mx-auto mb-32 ${
              i % 2 === 1 ? "md:[direction:rtl]" : ""
            }`}
            data-mascot={i === 0 ? "Hover the portrait. See them come alive." : undefined}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="aspect-[4/5] rounded-lg overflow-hidden bg-gauze ltr"
              style={{ direction: "ltr" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={d.img}
                alt={d.name}
                className="w-full h-full object-cover grayscale hover:grayscale-0 contrast-105 transition-all duration-700"
              />
            </motion.div>

            <div style={{ direction: "ltr" }}>
              <p className="display text-[clamp(26px,3.5vw,44px)] leading-[1.15] mb-7">
                <span className="text-ocean">&ldquo;</span>
                {d.quote}
                <span className="text-ocean">&rdquo;</span>
              </p>
              <p className="text-base text-ink-soft max-w-lg mb-6 leading-relaxed">{d.body}</p>
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <strong className="text-base">{d.name}</strong>
                  <div className="mono text-[11px] tracking-widest text-muted mt-0.5">
                    {d.credential.toUpperCase()} · {d.city.toUpperCase()}
                  </div>
                </div>
                <span className="inline-block px-3 py-1 bg-ink text-electric mono text-[10px] tracking-widest rounded-full">
                  VERIFIED ON STATDOCTOR
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/* ============ NUMBERS BAND ============ */
function Numbers() {
  return (
    <section className="py-24 px-6 border-y border-ink/10 bg-bone" data-mascot="The numbers — growing every week.">
      <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { v: 300, suf: "+", label: "Doctors on the platform" },
          { v: 60, suf: "+", label: "Partner clinics & hospitals" },
          { v: 500, pre: "$", suf: "+", label: "More earned per shift" },
          { v: 0, suf: "%", label: "Agency commission · ever" },
        ].map((n, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "150px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="pl-6 border-l border-ink/15"
          >
            <div className="display text-[clamp(48px,6vw,84px)] leading-none">
              <Counter to={n.v} prefix={n.pre} suffix="" />
              <sup className="text-[0.45em] text-ocean align-top ml-0.5">{n.suf}</sup>
            </div>
            <div className="mono text-[10px] tracking-widest uppercase text-muted mt-3">{n.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ============ CHAPTER 05 — INVITATION ============ */
function ChapterInvitation() {
  return (
    <section className="py-40 px-6 text-center relative" data-mascot="You made it. Your next shift is one tap away.">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #cde35d, transparent 70%)" }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #3232ff, transparent 70%)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative max-w-4xl mx-auto"
      >
        <div className="eyebrow mb-4">Chapter 05 · The Invitation</div>
        <h2 className="display text-[clamp(48px,7.5vw,112px)] leading-[0.98]">
          If you&apos;re a doctor,
          <br />
          <em className="italic text-ocean">this is for you.</em>
        </h2>

        <div className="flex flex-wrap gap-4 justify-center mt-12">
          <MagneticButton href="https://linktr.ee/statdoctorau" variant="primary" external>
            Download StatDoctor →
          </MagneticButton>
          <MagneticButton href="/hospitals" variant="ghost">
            I&apos;m a hospital
          </MagneticButton>
        </div>

        <div className="flex gap-4 justify-center mt-10">
          <a href="https://apps.apple.com/au/app/statdoctor/id6452677138" target="_blank" rel="noopener" data-hover>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://cdn.prod.website-files.com/688db6d677516719c3925d01/68fa0d2a1d41210a78792018_pngegg%20(2).png" alt="App Store" className="h-12 hover:scale-105 transition" />
          </a>
          <a href="https://play.google.com/store/apps/details?id=user.statdoctor.app&hl=en_AU" target="_blank" rel="noopener" data-hover>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://cdn.prod.website-files.com/688db6d677516719c3925d01/68fa0d1e7e5d4077dcdbc6e7_pngegg%20(1).png" alt="Google Play" className="h-12 hover:scale-105 transition" />
          </a>
        </div>

        <div className="mt-10 mono text-xs tracking-widest text-muted">
          <strong className="text-ink">247 doctors</strong> joined this month
        </div>
      </motion.div>
    </section>
  );
}
