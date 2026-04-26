"use client";
import { useEffect, useRef, useState, MouseEvent } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
  useMotionValue,
} from "framer-motion";
import Link from "next/link";
import MagneticButton from "@/components/MagneticButton";

/* =========================================================
   HOMEPAGE
   01 Hero · 02 Logos · 03 Agency tax (scroll bar) ·
   04 How it works (pinned phone) · 05 First month roadmap ·
   06 Doctor voices (auto carousel) · 07 Comparison · 08 FAQ · 09 CTA
   ========================================================= */

const SHIFTS_SAMPLE = [
  { specialty: "ED Registrar", place: "Royal Melbourne", rate: 145 },
  { specialty: "GP Locum", place: "Bendigo Health", rate: 180 },
  { specialty: "Anaesthetics", place: "St Vincent's Sydney", rate: 210 },
  { specialty: "Paediatrics", place: "Queensland Children's", rate: 165 },
];

const DOCTORS = [
  {
    name: "Dr Layth Samari",
    credential: "ACEM Trainee",
    city: "Melbourne",
    img: "/doctors/dr-layth.png",
    quote:
      "A great initiative to help doctors take charge of their own work-life balance.",
    detail: "14 months on StatDoctor · weekend ED shifts across regional Victoria",
  },
  {
    name: "Dr Priya Shah",
    credential: "GP Fellow",
    city: "Sydney",
    img: "/doctors/dr-priya.png",
    quote:
      "I see available shifts on my own terms. No phone calls from agency reps.",
    detail: "First shift booked within 48 hours of signing up",
  },
  {
    name: "Dr David Burton",
    credential: "Emergency Medicine",
    city: "Brisbane",
    img: "/doctors/dr-david.png",
    quote:
      "Easy and clear. I communicate shifts and availability across multiple hospitals.",
    detail: "Works with four Queensland hospitals · saved ~8 hrs/week on agency calls",
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

/* Word-stagger reveal — replaces the per-character SplitText gimmick */
function Words({ children, className = "", delay = 0 }: { children: string; className?: string; delay?: number }) {
  const words = children.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.85,
              delay: delay + i * 0.06,
              ease: [0.2, 0.8, 0.2, 1],
            }}
          >
            {w}
            {i < words.length - 1 && " "}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export default function HomeClient() {
  return (
    <>
      <Hero />
      <LogosStrip />
      <AgencyTax />
      <HowItWorks />
      <Roadmap />
      <DoctorVoices />
      <Comparison />
      <FAQ />
      <AppCTA />
    </>
  );
}

/* ============ HERO ============ */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yStats = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const yHead = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const opacityHead = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  return (
    <section ref={ref} className="min-h-[92vh] flex items-center px-6 pt-32 pb-24 relative overflow-hidden">
      {/* Soft background tint */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 600px at 80% 0%, rgba(205,227,93,0.18), transparent 60%)",
        }}
      />

      <div className="max-w-[1280px] mx-auto w-full grid md:grid-cols-12 gap-10 items-end relative">
        <motion.div style={{ y: yHead, opacity: opacityHead }} className="md:col-span-9">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="eyebrow mb-7"
          >
            Australia&apos;s locum doctor marketplace
          </motion.div>
          <h1 className="display text-[clamp(48px,8.5vw,140px)] leading-[0.95] tracking-tight">
            <Words>Shifts that pay</Words>
            <br />
            <Words delay={0.2}>you fully.</Words>
            <br />
            <span className="italic">
              <Words delay={0.45}>No agency in the middle.</Words>
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05, ease: [0.2, 0.8, 0.2, 1] }}
            className="mt-8 max-w-2xl text-lg md:text-xl text-ink/75 leading-relaxed"
          >
            StatDoctor connects Australian doctors directly with hospitals and clinics. You see the
            full rate, you keep the full rate, and you book on your own terms.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.25 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton href="https://linktr.ee/statdoctorau" variant="primary" external>
              Download StatDoctor →
            </MagneticButton>
            <MagneticButton href="/hospitals" variant="ghost">
              For hospitals
            </MagneticButton>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: yStats }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="md:col-span-3 grid grid-cols-3 md:grid-cols-1 gap-6 md:gap-8 md:border-l md:border-ink/15 md:pl-8"
        >
          {[
            { v: "300+", l: "Doctors on the platform" },
            { v: "60+", l: "Partner hospitals & clinics" },
            { v: "0%", l: "Commission, ever" },
          ].map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 1.5 + i * 0.12 }}
            >
              <div className="display text-4xl md:text-5xl leading-none">{s.v}</div>
              <div className="text-xs text-muted mt-2 leading-snug">{s.l}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.7 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[10px] tracking-[0.3em] text-muted"
      >
        <span>SCROLL</span>
        <span className="block w-px h-12 bg-ink/15 overflow-hidden relative">
          <span className="absolute inset-0 bg-ink animate-[scrollLine_2s_ease-in-out_infinite]" />
        </span>
      </motion.div>
      <style jsx>{`
        @keyframes scrollLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </section>
  );
}

/* ============ LOGOS STRIP ============ */
function LogosStrip() {
  return (
    <section className="py-16 px-6 border-y border-line bg-bone">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center text-xs tracking-[0.2em] uppercase text-muted mb-8">
          Trusted by 60+ healthcare facilities across Australia
        </div>
        <div className="marquee-mask">
          <div className="flex gap-16 w-max animate-marquee-slow items-center hover:[animation-play-state:paused]">
            {[...LOGOS, ...LOGOS].map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt="" className="h-12 w-auto opacity-90 hover:opacity-100 transition" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ AGENCY TAX — scroll-driven bar visual ============ */
function AgencyTax() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Bar starts full-width green. From 0.2-0.5 a 22% chunk slides off (orange).
  // At 0.7-1.0 the bar refills with a sweep of lime ("StatDoctor takes 0%").
  const sliceX = useTransform(scrollYProgress, [0.2, 0.5], [0, 320]);
  const sliceRot = useTransform(scrollYProgress, [0.2, 0.5], [0, 30]);
  const sliceOp = useTransform(scrollYProgress, [0.45, 0.6], [1, 0]);
  const refillW = useTransform(scrollYProgress, [0.7, 0.95], [78, 100]);
  const refillOp = useTransform(scrollYProgress, [0.65, 0.78], [0, 1]);
  const headOpacity = useTransform(scrollYProgress, [0, 0.05, 0.85, 1], [0, 1, 1, 0.4]);

  // Headline shifts subtly through phases
  const headline = useTransform(scrollYProgress, (v) => {
    if (v < 0.45) return "Australian doctors lose ~$1.4B a year to agencies.";
    if (v < 0.7) return "Roughly 20% of every locum shift skimmed off the top.";
    return "We don't take a cent. Doctors keep 100%.";
  });
  const [headText, setHeadText] = useState("Australian doctors lose ~$1.4B a year to agencies.");
  useEffect(() => headline.on("change", setHeadText), [headline]);

  return (
    <section ref={ref} className="bg-ink text-bone relative" style={{ height: "260vh" }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center px-6 overflow-hidden">
        <div className="max-w-[1100px] mx-auto w-full">
          <motion.div style={{ opacity: headOpacity }}>
            <div className="text-xs tracking-[0.2em] uppercase text-bone/50 mb-6">
              The agency tax
            </div>
            <AnimatePresence mode="wait">
              <motion.h2
                key={headText}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                className="display text-[clamp(40px,6.5vw,96px)] leading-[1.0] max-w-5xl"
              >
                {headText}
              </motion.h2>
            </AnimatePresence>
          </motion.div>

          <div className="mt-16 max-w-3xl">
            <div className="flex justify-between items-end mb-3 text-xs tracking-widest uppercase">
              <span className="text-bone/60">Doctor wages — 100% of the rate</span>
              <motion.span style={{ opacity: useTransform(sliceOp, [0, 1], [0.3, 1]) }} className="text-electric">
                Agency cut · 22% →
              </motion.span>
            </div>
            <div className="relative h-14">
              {/* Refill (success) bar — fades in at the end */}
              <motion.div
                style={{ width: useTransform(refillW, (v) => `${v}%`), opacity: refillOp }}
                className="absolute inset-y-0 left-0 rounded-full bg-electric"
              />
              {/* Base bar */}
              <motion.div
                style={{ opacity: useTransform(refillOp, [0, 1], [1, 0]) }}
                className="absolute inset-0 rounded-full overflow-hidden"
              >
                <div className="absolute inset-y-0 left-0 w-[78%] bg-electric/80" />
                <div className="absolute inset-y-0 right-0 w-[22%] bg-electric/15" />
              </motion.div>
              {/* Slice fly-off */}
              <motion.div
                style={{
                  x: sliceX,
                  rotate: sliceRot,
                  opacity: sliceOp,
                  width: "22%",
                }}
                className="absolute right-0 inset-y-0 rounded-full bg-[#FF8A65] origin-center"
              />
            </div>
            <motion.div
              style={{ opacity: refillOp }}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric text-ink text-xs tracking-widest uppercase font-semibold"
            >
              Agency cut · removed
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-10 inset-x-0 flex justify-center text-[10px] tracking-[0.3em] text-bone/40">
          KEEP SCROLLING
        </div>
      </div>
    </section>
  );
}

/* ============ HOW IT WORKS — sticky pinned phone ============ */
function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);

  const steps = [
    {
      tag: "01",
      title: "See every shift in your state.",
      body: "Real-time feed of open shifts. Filter by specialty, rate, location and date.",
    },
    {
      tag: "02",
      title: "Know the rate upfront.",
      body: "Every shift shows what you'll earn before you apply. No negotiation loops.",
    },
    {
      tag: "03",
      title: "Book in two taps.",
      body: "Upload your credentials once. Apply with one tap. Hospitals confirm instantly.",
    },
    {
      tag: "04",
      title: "Paid in 48 hours.",
      body: "Work the shift, get paid. No invoicing, no chasing, no six-week waits.",
    },
  ];

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      if (v < 0.20) setStep(0);
      else if (v < 0.45) setStep(1);
      else if (v < 0.70) setStep(2);
      else setStep(3);
    });
    return () => unsub();
  }, [scrollYProgress]);

  // Phone tilts and floats subtly with progress
  const phoneRotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);
  const phoneY = useTransform(scrollYProgress, [0, 0.5, 1], [40, -10, 20]);
  const phoneScale = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.92, 1, 1, 0.96]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.06, 0.12], [1, 1, 0]);

  const current = steps[step];

  return (
    <section ref={ref} className="bg-bone relative" style={{ height: "500vh" }}>
      <div className="sticky top-0 h-screen flex items-center px-6 overflow-hidden">
        <div className="max-w-[1280px] mx-auto w-full relative">
          {/* Intro header — fades out as tour begins */}
          <motion.div
            style={{ opacity: headerOpacity }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6"
          >
            <div className="eyebrow mb-3">How it works</div>
            <h2 className="display text-[clamp(40px,7vw,96px)] leading-[1.0] max-w-3xl">
              Four screens. <span className="italic">That&apos;s the whole app.</span>
            </h2>
            <p className="mt-5 text-sm tracking-widest uppercase text-muted">Scroll to walk through</p>
          </motion.div>

          {/* Tour grid */}
          <div className="grid md:grid-cols-[1fr_320px_1fr] gap-12 items-center">
            {/* Step list */}
            <ul className="flex flex-col gap-1">
              {steps.map((s, i) => (
                <motion.li
                  key={s.tag}
                  animate={{ opacity: step === i ? 1 : 0.35 }}
                  transition={{ duration: 0.5 }}
                  className="border-t border-ink/15 py-5"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs tracking-widest text-muted shrink-0">{s.tag}</span>
                    <h4 className="display text-2xl md:text-3xl leading-tight">{s.title}</h4>
                  </div>
                  <AnimatePresence>
                    {step === i && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-sm text-muted mt-2 ml-9 leading-relaxed overflow-hidden max-w-md"
                      >
                        {s.body}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.li>
              ))}
            </ul>

            {/* Phone with motion */}
            <motion.div style={{ rotate: phoneRotate, y: phoneY, scale: phoneScale }}>
              <PhoneMock step={step} />
            </motion.div>

            {/* Right callout */}
            <div className="hidden md:block self-center pl-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                  className="border-l-2 border-electric pl-6 max-w-xs"
                >
                  <div className="text-xs tracking-widest uppercase text-muted mb-2">
                    Step {current.tag} · Currently viewing
                  </div>
                  <div className="display text-3xl leading-tight mb-3">{current.title}</div>
                  <p className="text-sm text-muted leading-relaxed">{current.body}</p>
                </motion.div>
              </AnimatePresence>
              <div className="mt-10 flex items-center gap-2">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className="h-[2px] rounded-full transition-all duration-500"
                    style={{
                      width: step === i ? 36 : 14,
                      background: step >= i ? "#1a1a2e" : "rgba(26,26,46,0.18)",
                    }}
                  />
                ))}
                <span className="ml-3 text-xs tracking-widest text-muted">
                  {String(step + 1).padStart(2, "0")} / 04
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneMock({ step }: { step: number }) {
  const labels = ["Browse", "Details", "Confirm", "Earnings"];
  const titles = ["Shifts near you", "Rate & details", "Book this shift", "Cleared & paid"];
  return (
    <div className="relative mx-auto w-full max-w-[300px] aspect-[9/18.5] bg-ink rounded-[40px] p-2.5 shadow-[0_50px_100px_-30px_rgba(26,26,46,0.55)]">
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-ink rounded-full z-20" />
      <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-bone">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute inset-0 p-4 pt-12 text-ink"
          >
            <div className="text-[9px] tracking-widest uppercase text-muted">
              StatDoctor · {labels[step]}
            </div>
            <div className="display text-lg mt-3 leading-tight">{titles[step]}</div>
            <div className="mt-4 space-y-2">
              {SHIFTS_SAMPLE.slice(0, step === 3 ? 2 : 4).map((s, k) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: k * 0.06 }}
                  className="rounded-xl border border-ink/10 p-2.5 bg-bone"
                >
                  <div className="flex justify-between items-baseline">
                    <div className="text-[10px] font-medium">{s.specialty}</div>
                    <div className="text-xs font-semibold">${s.rate}/hr</div>
                  </div>
                  <div className="text-[10px] text-muted mt-0.5">{s.place}</div>
                </motion.div>
              ))}
            </div>
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-electric text-ink text-[9px] font-semibold tracking-widest"
              >
                PAID · 48 HOURS
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============ ROADMAP — vertical timeline with scroll fill ============ */
function Roadmap() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 30%"] });
  const lineH = useSpring(useTransform(scrollYProgress, [0, 1], [0, 100]), { damping: 30, stiffness: 100 });

  const milestones = [
    {
      day: "Day 1",
      title: "Sign up & upload credentials",
      body: "AHPRA, indemnity, CV. Five minutes once, then never again.",
    },
    {
      day: "Day 2",
      title: "Verified",
      body: "Our team verifies overnight. You get a notification when you're live.",
    },
    {
      day: "Day 3",
      title: "First shift booked",
      body: "Browse the live feed, tap apply, hospital confirms. Most doctors find their first shift within 48 hours of being verified.",
    },
    {
      day: "Week 1",
      title: "First payout",
      body: "Shift worked, payment cleared. 48 hours from clock-out to cash in your account.",
    },
    {
      day: "Month 1",
      title: "Eight shifts and counting",
      body: "Average StatDoctor user books 8 shifts in their first month — earning ~$3,400 more than they would have through an agency.",
    },
  ];

  return (
    <section ref={ref} className="py-32 px-6 bg-bone">
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <div className="eyebrow mb-3">Your first month</div>
          <h2 className="display text-[clamp(36px,5.5vw,72px)] leading-[1.0] max-w-3xl">
            From signup to your first <span className="italic">$3,400 in earnings</span>.
          </h2>
        </motion.div>

        <div className="relative grid md:grid-cols-[200px_1fr] gap-6 md:gap-12">
          {/* Vertical fill line */}
          <div className="hidden md:block absolute left-[200px] top-3 bottom-3 w-px bg-ink/10">
            <motion.div
              style={{ height: useTransform(lineH, (v) => `${v}%`) }}
              className="absolute top-0 left-0 right-0 bg-ink"
            />
          </div>

          <div className="md:col-start-2">
            {milestones.map((m, i) => {
              const segStart = i / milestones.length;
              const segEnd = (i + 0.6) / milestones.length;
              return <Milestone key={m.day} m={m} segStart={segStart} segEnd={segEnd} progress={scrollYProgress} />;
            })}
          </div>

          <div className="hidden md:flex md:row-start-1 flex-col gap-0 md:col-start-1 relative">
            {milestones.map((m, i) => (
              <div key={m.day} className="h-[180px] flex items-start pt-2">
                <div className="text-sm font-medium tracking-wide">{m.day}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Milestone({
  m,
  segStart,
  segEnd,
  progress,
}: {
  m: { day: string; title: string; body: string };
  segStart: number;
  segEnd: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const op = useTransform(progress, [segStart - 0.05, segStart, segEnd], [0.25, 0.55, 1]);
  const dotScale = useTransform(progress, [segStart - 0.05, segStart, segStart + 0.02], [0.6, 1, 1.2]);
  return (
    <motion.div style={{ opacity: op }} className="h-[180px] relative">
      <div className="md:hidden text-xs tracking-widest uppercase text-muted mb-2">{m.day}</div>
      <motion.div
        style={{ scale: dotScale }}
        className="hidden md:block absolute -left-[58px] top-3 w-3 h-3 rounded-full bg-ink ring-4 ring-bone"
      />
      <div className="display text-2xl md:text-3xl leading-tight max-w-xl">{m.title}</div>
      <p className="text-sm md:text-base text-muted mt-3 leading-relaxed max-w-2xl">{m.body}</p>
    </motion.div>
  );
}

/* ============ DOCTOR VOICES — auto-scrolling marquee carousel ============ */
function DoctorVoices() {
  const cards = [...DOCTORS, ...DOCTORS]; // duplicate for seamless loop
  return (
    <section className="py-32 border-y border-line bg-bone overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 mb-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="flex items-end justify-between flex-wrap gap-6"
        >
          <div>
            <div className="eyebrow mb-3">Doctors using StatDoctor</div>
            <h2 className="display text-[clamp(36px,5vw,68px)] leading-[1.0] max-w-2xl">
              Verified by AHPRA. <span className="italic">Earning more</span>, calling fewer agencies.
            </h2>
          </div>
          <div className="text-sm text-muted">Hover to pause →</div>
        </motion.div>
      </div>

      <div className="marquee-mask">
        <div className="flex gap-6 w-max animate-marquee hover:[animation-play-state:paused]">
          {cards.map((d, i) => (
            <article
              key={i}
              className="shrink-0 w-[420px] bg-bone border border-ink/10 rounded-2xl overflow-hidden hover:scale-[1.02] hover:shadow-2xl transition-all duration-400"
              data-hover
            >
              <div className="aspect-[5/4] overflow-hidden bg-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={d.img}
                  alt={d.name}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="p-7">
                <p className="display text-xl leading-snug">&ldquo;{d.quote}&rdquo;</p>
                <div className="mt-6 pt-5 border-t border-ink/10">
                  <div className="font-semibold text-sm">{d.name}</div>
                  <div className="text-xs text-muted mt-1">
                    {d.credential} · {d.city}
                  </div>
                  <div className="text-xs text-muted mt-3 leading-relaxed">{d.detail}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ COMPARISON TABLE ============ */
function Comparison() {
  const rows: Array<[string, string, string]> = [
    ["Commission on each shift", "18–22% to the agency", "0%"],
    ["Time from signup to first shift", "1–3 weeks", "Often under 48 hours"],
    ["Payout speed", "10–14 days, then chase finance", "Within 48 hours"],
    ["Rate visibility before booking", "Quoted by agency rep", "Shown upfront, every time"],
    ["Communication", "Phone calls and reps", "In-app, direct with the hospital"],
  ];
  return (
    <section className="py-32 px-6 bg-bone">
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="eyebrow mb-3">Side by side</div>
          <h2 className="display text-[clamp(36px,5vw,64px)] leading-[1.0] max-w-2xl mb-12">
            How a StatDoctor shift compares.
          </h2>
        </motion.div>
        <div className="border-t border-ink/15">
          <div className="grid grid-cols-[1.4fr_1fr_1fr] py-4 text-xs tracking-widest uppercase text-muted">
            <div></div>
            <div>Traditional agency</div>
            <div className="text-ink font-medium">StatDoctor</div>
          </div>
          {rows.map(([label, agency, stat], i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="grid grid-cols-[1.4fr_1fr_1fr] py-6 border-t border-ink/10 items-baseline group hover:bg-line/40 transition-colors duration-300"
            >
              <div className="text-sm md:text-base font-medium">{label}</div>
              <div className="text-sm text-muted">{agency}</div>
              <div className="text-sm md:text-base font-medium relative">
                <span className="relative z-10">{stat}</span>
                <span className="absolute inset-x-0 bottom-1 h-2 bg-electric/40 -z-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ FAQ ============ */
function FAQ() {
  const items = [
    {
      q: "Is StatDoctor free for doctors?",
      a: "Yes. There are no signup fees, no platform fees, and no commission taken from your rate. The full rate the hospital pays is what you receive.",
    },
    {
      q: "How does StatDoctor make money if you don't charge a commission?",
      a: "Hospitals pay a flat platform fee per shift filled — significantly less than the 18–22% they would have lost to an agency. Doctors are never charged.",
    },
    {
      q: "Which states are you live in?",
      a: "VIC, NSW, QLD and SA, with active partner hospitals in WA. We're rolling out across all states and territories through 2026.",
    },
    {
      q: "What credentials do I need to upload?",
      a: "AHPRA registration, indemnity insurance certificate, and a current CV. Upload once and apply to every shift with a single tap.",
    },
    {
      q: "How quickly do hospitals confirm a booking?",
      a: "Most shifts are confirmed within hours. Urgent same-day shifts are typically confirmed in under 30 minutes.",
    },
    {
      q: "What if a hospital cancels my shift?",
      a: "If a hospital cancels within 24 hours of the shift, StatDoctor's cancellation policy guarantees a partial payout. Full terms in the app.",
    },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-32 px-6 border-y border-line bg-bone">
      <div className="max-w-[900px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="eyebrow mb-3">Frequently asked</div>
          <h2 className="display text-[clamp(36px,5vw,64px)] leading-[1.0] mb-12">
            Questions doctors ask first.
          </h2>
        </motion.div>
        <div className="border-t border-ink/15">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-b border-ink/15">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex justify-between items-center text-left py-6 hover:opacity-80 transition-opacity"
                  aria-expanded={isOpen}
                  data-hover
                >
                  <span className="display text-xl md:text-2xl pr-6">{item.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                    className="text-2xl text-muted shrink-0"
                    aria-hidden
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-base text-muted leading-relaxed max-w-2xl">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============ APP CTA — magnetic + spotlight ============ */
function AppCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { damping: 20, stiffness: 120 });
  const sy = useSpring(y, { damping: 20, stiffness: 120 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="py-40 px-6 bg-ink text-bone relative overflow-hidden"
    >
      {/* Cursor-following spotlight */}
      <motion.div
        style={{
          x: sx,
          y: sy,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none"
      >
        <div
          className="w-full h-full"
          style={{
            background: "radial-gradient(circle, rgba(205,227,93,0.18), transparent 60%)",
          }}
        />
      </motion.div>

      <div className="max-w-[1100px] mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="text-xs tracking-[0.3em] uppercase text-bone/50 mb-8">The invitation</div>
          <h2 className="display text-[clamp(48px,8vw,128px)] leading-[0.98]">
            <span className="block">If you&apos;re a doctor,</span>
            <span className="block italic text-electric">this is for you.</span>
          </h2>
          <p className="text-lg text-bone/70 max-w-xl mx-auto mt-8 leading-relaxed">
            Free for doctors. Always. Download the app, upload your credentials once, and your next
            shift is one tap away.
          </p>
          <div className="mt-12 flex flex-wrap gap-4 justify-center items-center">
            <MagneticButton href="https://linktr.ee/statdoctorau" variant="electric" external>
              Download StatDoctor →
            </MagneticButton>
            <MagneticButton href="/hospitals" variant="ghost">
              I&apos;m a hospital
            </MagneticButton>
          </div>
          <div className="mt-10 flex gap-4 justify-center items-center">
            <a
              href="https://apps.apple.com/au/app/statdoctor/id6452677138"
              target="_blank"
              rel="noopener"
              className="hover:opacity-80 transition-opacity"
              data-hover
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://cdn.prod.website-files.com/688db6d677516719c3925d01/68fa0d2a1d41210a78792018_pngegg%20(2).png"
                alt="App Store"
                className="h-12"
              />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=user.statdoctor.app&hl=en_AU"
              target="_blank"
              rel="noopener"
              className="hover:opacity-80 transition-opacity"
              data-hover
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://cdn.prod.website-files.com/688db6d677516719c3925d01/68fa0d1e7e5d4077dcdbc6e7_pngegg%20(1).png"
                alt="Google Play"
                className="h-12"
              />
            </a>
          </div>
          <div className="mt-12 text-xs tracking-[0.3em] uppercase text-bone/40">
            247 doctors joined this month
          </div>
        </motion.div>
      </div>
    </section>
  );
}
