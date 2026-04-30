"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import HeroMap from "@/components/home/HeroMap";

/* =========================================================
   HOMEPAGE — clean rebuild
   01 Hero map · 02 Logos · 03 DNA · 04 Founder video ·
   05 Testimonials (Lyra columns) · 06 FAQ
   ========================================================= */

export default function HomeClient() {
  return (
    <div className="bg-white text-ink">
      <HeroMap />
      <LogosStrip />
      <FounderVideo />
      <HowItWorksDNA />
      <DoctorVoicesPinned />
      <FAQGrid />
    </div>
  );
}

/* ============================================================
   02 — LOGOS STRIP
   ============================================================ */
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

function LogosStrip() {
  const half = LOGOS.slice(0, Math.ceil(LOGOS.length / 2));
  const otherHalf = LOGOS.slice(Math.ceil(LOGOS.length / 2));
  return (
    <section className="py-14 md:py-16 border-y border-ink/8 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between flex-wrap gap-4"
        >
          <div>
            <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-2">The network</div>
            <h2 className="display text-[clamp(24px,3.2vw,40px)] leading-[1.05] max-w-2xl">
              Trusted by hospitals from <span className="italic text-ocean">Cairns to Hobart</span>.
            </h2>
          </div>
          <div className="text-[10px] tracking-[0.22em] uppercase text-muted">
            44 partners · growing weekly
          </div>
        </motion.div>
      </div>

      <div className="space-y-4">
        {/* 2-copy duplication = seamless loop with translateX(-50%) — 3 copies caused a snap-back */}
        <LogosRow logos={[...half, ...half]} reverse={false} />
        <LogosRow logos={[...otherHalf, ...otherHalf]} reverse />
      </div>
    </section>
  );
}

function LogosRow({ logos, reverse }: { logos: string[]; reverse: boolean }) {
  return (
    <div className="marquee-mask">
      <div
        className={`flex gap-12 md:gap-16 w-max items-center ${
          reverse ? "animate-marquee-reverse" : "animate-marquee-slow"
        } hover:[animation-play-state:paused]`}
      >
        {logos.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt=""
            className="h-12 md:h-16 w-auto opacity-60 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0"
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   03 — HOW IT WORKS · horizontal dot-particle DNA
   Sequential reveal: only the active step's card shows
   ============================================================ */
const STEPS = [
  {
    n: "01",
    title: "Verify",
    body: "Upload AHPRA, indemnity and your CV once. Verified overnight.",
  },
  {
    n: "02",
    title: "Match",
    body: "See every open shift in your state with the rate shown upfront.",
  },
  {
    n: "03",
    title: "Book",
    body: "One tap to apply. The hospital confirms — usually within hours.",
  },
  {
    n: "04",
    title: "Paid",
    body: "Money in your account within 48 hours. Zero chasing finance.",
  },
];

function HowItWorksDNA() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const u = scrollYProgress.on("change", (v) => {
      // 4 step bands across the pinned scroll: 0–0.25, 0.25–0.5, 0.5–0.75, 0.75–1
      const idx = Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * STEPS.length)));
      setActiveStep(idx);
    });
    return () => u();
  }, [scrollYProgress]);

  // Helix geometry — horizontal, 4 step nodes
  const W = 1200;
  const H = 240;
  const cy = H / 2;
  const amp = 70;
  const turns = 2.5;
  const dotsPerStrand = 220;
  const drawProgress = useSpring(scrollYProgress, { damping: 30, stiffness: 80 });

  const strandA = useMemo(
    () =>
      Array.from({ length: dotsPerStrand }, (_, i) => {
        const t = i / (dotsPerStrand - 1);
        const x = t * W;
        const phase = t * Math.PI * 2 * turns;
        const y = cy + Math.sin(phase) * amp;
        const z = Math.cos(phase); // -1..1, governs perceived depth
        return { x, y, z, t };
      }),
    [],
  );
  const strandB = useMemo(
    () =>
      Array.from({ length: dotsPerStrand }, (_, i) => {
        const t = i / (dotsPerStrand - 1);
        const x = t * W;
        const phase = t * Math.PI * 2 * turns + Math.PI;
        const y = cy + Math.sin(phase) * amp;
        const z = Math.cos(phase);
        return { x, y, z, t };
      }),
    [],
  );

  const nodeXs = STEPS.map((_, i) => W * (0.12 + i * 0.255));
  const nodes = nodeXs.map((x) => {
    const t = x / W;
    const phase = t * Math.PI * 2 * turns;
    return {
      x,
      yA: cy + Math.sin(phase) * amp,
      yB: cy + Math.sin(phase + Math.PI) * amp,
    };
  });

  return (
    <section ref={ref} className="relative bg-white" style={{ height: "280vh" }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {/* soft tinted backdrop */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 40%, rgba(50,50,255,0.06), transparent 70%), radial-gradient(70% 60% at 50% 90%, rgba(205,227,93,0.10), transparent 70%)",
          }}
        />

        <div className="relative max-w-[1280px] mx-auto w-full px-6">
          {/* heading */}
          <div className="text-center mb-10 md:mb-14">
            <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-2">How StatDoctor works</div>
            <h2 className="display text-[clamp(28px,4.2vw,56px)] leading-[1.0] max-w-3xl mx-auto">
              Four steps. <span className="italic text-ocean">No agency in the middle.</span>
            </h2>
          </div>

          {/* horizontal dot-particle helix */}
          <div className="relative">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block">
              <defs>
                <radialGradient id="dotA" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#3232ff" />
                  <stop offset="100%" stopColor="#1a1a2e" />
                </radialGradient>
                <radialGradient id="dotB" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#cde35d" />
                  <stop offset="100%" stopColor="#1a1a2e" />
                </radialGradient>
              </defs>

              {/* Strand A dots */}
              {strandA.map((p, i) => (
                <DotParticle key={`a-${i}`} p={p} progress={drawProgress} fill="url(#dotA)" />
              ))}
              {/* Strand B dots */}
              {strandB.map((p, i) => (
                <DotParticle key={`b-${i}`} p={p} progress={drawProgress} fill="url(#dotB)" />
              ))}

              {/* Step nodes */}
              {nodes.map((n, i) => {
                const segReveal = i / STEPS.length;
                return (
                  <DNANode
                    key={i}
                    n={n}
                    label={STEPS[i].n}
                    revealAt={segReveal}
                    progress={scrollYProgress}
                    active={activeStep === i}
                  />
                );
              })}
            </svg>

            {/* Sequential card reveal — positioned above each node, anchored
                to the node's side of the canvas so the last card never spills off-screen */}
            <div className="absolute inset-0 pointer-events-none">
              {STEPS.map((s, i) => {
                const xPct = (nodeXs[i] / W) * 100;
                // Anchor strategy: first node → left-aligned, last → right-aligned, middle → centered
                const anchorLeft = i === 0;
                const anchorRight = i === STEPS.length - 1;
                const positionStyle: React.CSSProperties = anchorLeft
                  ? { left: `max(0px, calc(${xPct}% - 40px))`, transform: "translateX(0)" }
                  : anchorRight
                  ? { right: `max(0px, calc(${100 - xPct}% - 40px))`, transform: "translateX(0)" }
                  : { left: `${xPct}%`, transform: "translateX(-50%)" };
                return (
                  <AnimatePresence key={s.n}>
                    {activeStep === i && (
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.95 }}
                        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                        className="absolute pointer-events-auto"
                        style={{
                          ...positionStyle,
                          // Always above the helix so timeline pills below stay close
                          bottom: "calc(50% + 70px)",
                        }}
                      >
                        <StepCard step={s} index={i} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                );
              })}
            </div>
          </div>

          {/* progress bar / step counter */}
          <div className="mt-12 md:mt-14 flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {STEPS.map((s, i) => (
              <button
                key={s.n}
                onClick={() => {
                  if (!ref.current) return;
                  const sectionTop = ref.current.offsetTop;
                  const sectionHeight = ref.current.offsetHeight - window.innerHeight;
                  const target = sectionTop + (i + 0.5) / STEPS.length * sectionHeight;
                  window.scrollTo({ top: target, behavior: "smooth" });
                }}
                className="group flex items-center gap-2"
              >
                <span
                  className="block h-[2px] rounded-full transition-all duration-500"
                  style={{
                    width: activeStep === i ? 56 : 18,
                    background: activeStep >= i ? "#3232ff" : "rgba(26,26,46,0.18)",
                  }}
                />
                <span className={`text-[10px] tracking-[0.22em] uppercase transition-colors ${activeStep === i ? "text-ocean" : "text-muted"}`}>
                  {s.n} · {s.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DotParticle({
  p,
  progress,
  fill,
}: {
  p: { x: number; y: number; z: number; t: number };
  progress: ReturnType<typeof useSpring>;
  fill: string;
}) {
  // Each particle reveals when scroll progress passes its t-position
  const op = useTransform(progress, [p.t - 0.05, p.t + 0.02], [0, 1]);
  // Depth: dots in front (z>0) larger & more opaque, dots behind (z<0) smaller & faded
  const r = 1.4 + (p.z + 1) * 1.4; // 1.4..4.2
  const dimmer = 0.35 + ((p.z + 1) / 2) * 0.65; // 0.35..1.0
  return (
    <motion.circle
      cx={p.x}
      cy={p.y}
      r={r}
      fill={fill}
      style={{ opacity: useTransform(op, (v) => v * dimmer) }}
    />
  );
}

function DNANode({
  n,
  label,
  revealAt,
  progress,
  active,
}: {
  n: { x: number; yA: number; yB: number };
  label: string;
  revealAt: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  active: boolean;
}) {
  const op = useTransform(progress, [revealAt - 0.03, revealAt + 0.04], [0, 1]);
  return (
    <g>
      {/* connector */}
      <motion.line
        x1={n.x}
        y1={n.yA}
        x2={n.x}
        y2={n.yB}
        stroke="#1a1a2e"
        strokeWidth="1.5"
        strokeOpacity="0.35"
        style={{ opacity: op }}
      />
      {/* outer halo */}
      <motion.circle
        cx={n.x}
        cy={(n.yA + n.yB) / 2}
        r={active ? 22 : 16}
        fill="rgba(50,50,255,0.12)"
        style={{ opacity: op }}
        animate={active ? { r: [16, 26, 16], opacity: [0.6, 0, 0.6] } : { r: 16, opacity: 0 }}
        transition={{ duration: 2.2, repeat: active ? Infinity : 0, ease: "easeOut" }}
      />
      {/* core */}
      <motion.circle
        cx={n.x}
        cy={(n.yA + n.yB) / 2}
        r={active ? 9 : 6}
        fill={active ? "#cde35d" : "#3232ff"}
        stroke="#1a1a2e"
        strokeWidth="2"
        style={{ opacity: op }}
      />
      <motion.text
        x={n.x}
        y={(n.yA + n.yB) / 2 + 38}
        textAnchor="middle"
        fontSize="11"
        className="tracking-widest"
        fill="#6b7a73"
        style={{ opacity: op }}
      >
        {label}
      </motion.text>
    </g>
  );
}

function StepCard({ step, index }: { step: (typeof STEPS)[number]; index: number }) {
  return (
    <div className="w-[260px] md:w-[300px] rounded-2xl bg-white border border-ink/10 shadow-[0_30px_70px_-20px_rgba(26,26,46,0.25)] p-5 relative overflow-hidden">
      <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-ocean via-electric to-ocean" />
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] tracking-[0.22em] uppercase text-muted">Step {step.n}</div>
        <div className="w-6 h-6 rounded-full bg-ocean/10 grid place-items-center text-[10px] font-bold text-ocean">
          {index + 1}
        </div>
      </div>
      <h3 className="display text-2xl mb-2 leading-tight">{step.title}.</h3>
      <p className="text-xs md:text-[13px] text-muted leading-relaxed">{step.body}</p>
    </div>
  );
}

/* ============================================================
   04 — FOUNDER VIDEO (autoplay-on-scroll)
   ============================================================ */
function FounderVideo() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!ref.current || !videoRef.current) return;
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
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative bg-white pt-10 pb-14 md:pt-12 md:pb-20 px-4 md:px-6">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-2">
            From the founder
          </div>
          <h2 className="display text-[clamp(24px,3.6vw,44px)] leading-[1.0]">
            A note to my fellow <span className="italic text-ocean">locum doctors</span>.
          </h2>
        </motion.div>

        <div ref={ref} className="relative max-w-4xl mx-auto">
          {/* electric/ocean glow underneath the frame */}
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
              src="/founder-video.mp4"
              poster="/founder-video-poster.jpg"
              muted={muted}
              loop
              playsInline
              preload="metadata"
            />

            {/* mute / sound toggle */}
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

            {/* Founder credit */}
            <div className="absolute bottom-4 left-4 md:bottom-5 md:left-5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-ink/10 text-[11px] font-medium">
              Anurag G. · Founder, StatDoctor
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   05 — VOICES · Lyra-style 3-column auto-scrolling wall
   Column 1 ↑, Column 2 ↓, Column 3 ↑.  Real testimonies pulled
   from statdoctor.app. Hover any card to pause the column.
   ============================================================ */
const DOCTORS: {
  name: string;
  credential: string;
  img: string;
  quote: string;
  accent: "ocean" | "electric" | "leaf" | "ink";
}[] = [
  {
    name: "Dr Layth Samari",
    credential: "MD · ACEM Trainee",
    img: "/doctors/dr-layth.png",
    quote:
      "A great initiative to help doctors be in charge of their own work-life balance with the ease of picking up shifts on demand.",
    accent: "ocean",
  },
  {
    name: "Dr Brian Rose",
    credential: "MD · HMO",
    img: "/doctors/dr-david.png",
    quote:
      "StatDoctor enables me to see all the available shifts on my own device, on my own terms. No annoying phone calls from managing reps trying to push me to do shifts I don't want. It's the stress-free approach to locuming.",
    accent: "electric",
  },
  {
    name: "Dr Sophia Dean",
    credential: "MBChB · HMO",
    img: "/doctors/dr-priya.png",
    quote:
      "As a first-time locum from New Zealand, I've been thoroughly impressed with the efficiency and user-friendliness of this app. The ability to view available shifts, including exact dates and times, has made planning my work so much easier.",
    accent: "leaf",
  },
  {
    name: "Dr David Burton",
    credential: "MBChB · FRNZCGP",
    img: "/doctors/dr-david.png",
    quote:
      "StatDoctor is a brilliant solution to the ridiculous financial burden on public hospitals that locum agencies were charging, and the drudgery and admin of locuming. It's better, sleeker, easier to navigate and more invested in making locuming work well for both parties than any locum agency.",
    accent: "ocean",
  },
  {
    name: "Dr Alex Patinkin",
    credential: "MD · ACEM Trainee",
    img: "/doctors/dr-layth.png",
    quote:
      "I'm a full-time emergency registrar and locum frequently on the side through multiple big agencies. It's often difficult to find shifts because their job boards don't let me filter out work that doesn't fit my schedule. I love how much easier StatDoctor is to use.",
    accent: "electric",
  },
  {
    name: "Dr Marillo Jayasuriya",
    credential: "MD · FACEM",
    img: "/doctors/dr-david.png",
    quote:
      "Such an easy-to-use platform that gives locum doctors more control of their shifts.",
    accent: "ink",
  },
  {
    name: "Dr Greeshma Gopakumar",
    credential: "MD · HMO",
    img: "/doctors/dr-priya.png",
    quote:
      "On signing up, the whole process was extremely easy and straightforward. It's transparent with no hidden T&Cs unlike many agencies. Truly a game changer for locum doctors.",
    accent: "leaf",
  },
  {
    name: "Dr Priya Shah",
    credential: "GP Fellow",
    img: "/doctors/dr-priya.png",
    quote:
      "I see shifts on my own terms. No phone calls from agency reps. The rate is shown before I apply — that alone saves me hours.",
    accent: "ocean",
  },
  {
    name: "Dr Sarah Chen",
    credential: "Anaesthetics",
    img: "/doctors/dr-priya.png",
    quote:
      "I picked up three shifts this month I would have never seen otherwise. Confirmed in 20 minutes each.",
    accent: "electric",
  },
];

function DoctorVoicesPinned() {
  const cols: (typeof DOCTORS)[] = [[], [], []];
  DOCTORS.forEach((d, i) => cols[i % 3].push(d));

  return (
    <section className="relative bg-white py-16 md:py-20 px-6 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 0%, rgba(50,50,255,0.06), transparent 70%), radial-gradient(50% 40% at 50% 100%, rgba(205,227,93,0.10), transparent 70%)",
        }}
      />

      {/* heading */}
      <div className="relative max-w-[1280px] mx-auto mb-8 md:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-2">
            Doctors using StatDoctor
          </div>
          <h2 className="display text-[clamp(26px,4vw,52px)] leading-[1.0] max-w-3xl mx-auto">
            Verified by AHPRA. <span className="italic text-ocean">Earning more.</span> Calling fewer agencies.
          </h2>
        </motion.div>
      </div>

      {/* Three scrolling columns — 1 up, 2 down, 3 up */}
      <div className="relative max-w-[1280px] mx-auto h-[520px] md:h-[600px] overflow-hidden">
        {/* fade masks */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, white, transparent)" }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to top, white, transparent)" }}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 h-full">
          {cols.map((col, ci) => (
            <TestimonialColumn key={ci} cards={col} direction={ci % 2 === 0 ? "up" : "down"} duration={42 + ci * 6} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialColumn({
  cards,
  direction,
  duration,
}: {
  cards: typeof DOCTORS;
  direction: "up" | "down";
  duration: number;
}) {
  // Duplicate cards so the loop is seamless
  const doubled = [...cards, ...cards];
  return (
    <div className="relative h-full overflow-hidden">
      <div
        className="flex flex-col gap-5 md:gap-6 hover:[animation-play-state:paused]"
        style={{
          animation: `${direction === "up" ? "scrollColUp" : "scrollColDown"} ${duration}s linear infinite`,
        }}
      >
        {doubled.map((d, i) => (
          <TestimonialCard key={i} d={d} />
        ))}
      </div>

      <style jsx>{`
        @keyframes scrollColUp {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        @keyframes scrollColDown {
          from { transform: translateY(-50%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function TestimonialCard({ d }: { d: (typeof DOCTORS)[number] }) {
  const accent =
    d.accent === "ocean"
      ? "bg-ocean"
      : d.accent === "electric"
      ? "bg-electric"
      : d.accent === "leaf"
      ? "bg-leaf"
      : "bg-ink";
  return (
    <article
      className="relative bg-white border border-ink/10 rounded-2xl p-5 md:p-6 shadow-[0_15px_45px_-25px_rgba(26,26,46,0.18)] hover:shadow-[0_25px_60px_-25px_rgba(26,26,46,0.3)] hover:-translate-y-1 transition-all duration-300"
      data-hover
    >
      <span aria-hidden className={`absolute left-5 right-5 top-0 h-[2px] ${accent} rounded-full`} />
      <p className="display text-[15px] md:text-base leading-[1.4] text-ink">
        &ldquo;{d.quote}&rdquo;
      </p>
      <div className="mt-5 pt-4 border-t border-ink/8 flex items-center gap-3">
        <div className="relative shrink-0">
          <div className={`absolute -inset-0.5 rounded-full ${accent} opacity-50 blur-[2px]`} />
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={d.img}
              alt={d.name}
              className="w-full h-full object-cover scale-[1.6] object-[50%_22%]"
            />
          </div>
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-[13px] truncate">{d.name}</div>
          <div className="text-[11px] text-muted mt-0.5 truncate">{d.credential}</div>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   05 — FAQ · floating bubbles + centered answer panel
   Bubbles drift in a contained zone. The active answer always
   appears in a fixed central panel below — they cannot collide.
   ============================================================ */
type Tone = "ocean" | "electric" | "ink" | "leaf";
type AnswerDir = "up" | "down" | "left" | "right";
const FAQ_ITEMS: {
  q: string;
  a: string;
  tone: Tone;
  pos: { top: string; left: string };
  drift: "animate-drift-a" | "animate-drift-b" | "animate-drift-c";
  size: "sm" | "md" | "lg";
  answerDir: AnswerDir;
}[] = [
  {
    q: "How are doctors verified?",
    a: "StatDoctor conducts the same checks as any locum agency — confirming your identity, checking your AHPRA registration, and getting references.",
    tone: "ocean",
    pos: { top: "4%", left: "8%" },
    drift: "animate-drift-a",
    size: "md",
    answerDir: "down",
  },
  {
    q: "Do you charge doctors a fee?",
    a: "Unlike locum agencies we do not charge hospitals 15–30% on top of your locum rate. We work similar to SEEK — hospitals pay a small fee for accepted shifts (over 75% cheaper than any agency).",
    tone: "electric",
    pos: { top: "10%", left: "58%" },
    drift: "animate-drift-b",
    size: "lg",
    answerDir: "down",
  },
  {
    q: "Travel and accommodation?",
    a: "Not usually — most hospitals, particularly rural ones, will cover you for travel and accommodation expenses. This can be easily seen on the app before you apply.",
    tone: "leaf",
    pos: { top: "30%", left: "32%" },
    drift: "animate-drift-c",
    size: "md",
    answerDir: "down",
  },
  {
    q: "How much do locum doctors earn?",
    a: "Rates vary by seniority, specialty, location and time of year. Specialists average $2,500–$4,000 per day; HMOs earn $100–$180 per hour. The more rural a doctor is willing to work, the higher the rate.",
    tone: "ocean",
    pos: { top: "42%", left: "70%" },
    drift: "animate-drift-a",
    size: "lg",
    answerDir: "left",
  },
  {
    q: "Which states are you live in?",
    a: "VIC, NSW, QLD and SA — with active partner hospitals in WA and TAS. Rolling out across the rest through 2026.",
    tone: "ink",
    pos: { top: "56%", left: "6%" },
    drift: "animate-drift-b",
    size: "sm",
    answerDir: "right",
  },
  {
    q: "How fast do hospitals confirm?",
    a: "Most shifts confirm within hours. Urgent same-day shifts are typically confirmed in under 30 minutes — far faster than any agency.",
    tone: "electric",
    pos: { top: "70%", left: "44%" },
    drift: "animate-drift-c",
    size: "md",
    answerDir: "up",
  },
  {
    q: "What credentials do I upload?",
    a: "AHPRA registration, indemnity certificate, and a current CV. Upload once — every shift application after that is one tap.",
    tone: "ocean",
    pos: { top: "82%", left: "12%" },
    drift: "animate-drift-a",
    size: "md",
    answerDir: "up",
  },
  {
    q: "What if my shift gets cancelled?",
    a: "If a hospital cancels within 24 hours of the shift, StatDoctor's cancellation policy guarantees a partial payout. Full terms in the app.",
    tone: "leaf",
    pos: { top: "84%", left: "70%" },
    drift: "animate-drift-b",
    size: "sm",
    answerDir: "up",
  },
];

function FAQGrid() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <section className="relative bg-white py-16 md:py-20 px-6 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 30%, rgba(50,50,255,0.06), transparent 70%), radial-gradient(50% 50% at 85% 70%, rgba(205,227,93,0.10), transparent 70%)",
        }}
      />

      <div className="relative max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-2">FAQ</div>
          <h2 className="display text-[clamp(26px,4vw,52px)] leading-[1.0]">
            Still curious? <span className="italic text-ocean">Hover a question.</span>
          </h2>
          <p className="mt-3 text-[10px] tracking-[0.22em] uppercase text-muted">
            {FAQ_ITEMS.length} things doctors ask first
          </p>
        </motion.div>

        {/* Floating bubble field — desktop only. Hover/tap pops the answer next to the bubble. */}
        <div
          className="relative h-[760px] md:h-[820px] hidden md:block"
          onClick={() => setActiveIdx(null)}
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-50 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(26,26,46,0.07) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          {FAQ_ITEMS.map((item, i) => (
            <FAQBubble
              key={item.q}
              item={item}
              index={i}
              isActive={activeIdx === i}
              isDimmed={activeIdx !== null && activeIdx !== i}
              onActivate={() => setActiveIdx(i)}
              onDeactivate={() => setActiveIdx(null)}
            />
          ))}
        </div>

        {/* Mobile fallback — stacked accordion */}
        <div className="md:hidden mt-4 space-y-2">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.q}
              className="rounded-2xl bg-white border border-ink/10 px-4 py-3"
            >
              <summary className="display text-[15px] cursor-pointer">{item.q}</summary>
              <p className="text-[13px] text-muted leading-relaxed mt-2 pt-2 border-t border-ink/8">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQBubble({
  item,
  index,
  isActive,
  isDimmed,
  onActivate,
  onDeactivate,
}: {
  item: (typeof FAQ_ITEMS)[number];
  index: number;
  isActive: boolean;
  isDimmed: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const sizeClasses =
    item.size === "lg"
      ? "px-6 py-4 text-[15px] md:text-base max-w-[300px]"
      : item.size === "md"
      ? "px-5 py-3.5 text-sm md:text-[15px] max-w-[260px]"
      : "px-4 py-3 text-[13px] md:text-sm max-w-[230px]";

  const tone =
    item.tone === "ocean"
      ? "bg-ocean text-white border-ocean"
      : item.tone === "electric"
      ? "bg-electric text-ink border-electric"
      : item.tone === "leaf"
      ? "bg-leaf text-white border-leaf"
      : "bg-ink text-white border-ink";

  // Where the answer card pops out from the bubble
  const answerOffset = (() => {
    switch (item.answerDir) {
      case "up":    return { bottom: "calc(100% + 14px)", left: "50%", transform: "translateX(-50%)" };
      case "down":  return { top: "calc(100% + 14px)",    left: "50%", transform: "translateX(-50%)" };
      case "left":  return { right: "calc(100% + 14px)",  top: "50%",  transform: "translateY(-50%)" };
      case "right": return { left: "calc(100% + 14px)",   top: "50%",  transform: "translateY(-50%)" };
    }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.2, 0.8, 0.2, 1],
      }}
      animate={{
        opacity: isDimmed ? 0.18 : 1,
        scale: isDimmed ? 0.94 : 1,
      }}
      className={`absolute ${item.drift}`}
      style={{
        top: item.pos.top,
        left: item.pos.left,
        zIndex: isActive ? 30 : 10,
        transition: "opacity 0.35s ease, transform 0.35s ease",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <motion.button
        onMouseEnter={onActivate}
        onMouseLeave={onDeactivate}
        onClick={onActivate}
        animate={{ scale: isActive ? 1.05 : 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        className={`relative rounded-full border-2 font-medium text-left shadow-[0_18px_50px_-20px_rgba(26,26,46,0.3)] hover:shadow-[0_30px_70px_-20px_rgba(26,26,46,0.4)] transition-shadow ${sizeClasses} ${tone}`}
        data-hover
      >
        {item.q}
      </motion.button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: item.answerDir === "up" ? 8 : item.answerDir === "down" ? -8 : 0, x: item.answerDir === "left" ? 8 : item.answerDir === "right" ? -8 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute w-[300px] rounded-2xl bg-ink text-white p-5 shadow-[0_30px_70px_-20px_rgba(26,26,46,0.5)] z-40"
            style={answerOffset}
            onMouseEnter={onActivate}
            onMouseLeave={onDeactivate}
          >
            <span
              aria-hidden
              className={`absolute inset-x-0 top-0 h-[2px] ${
                item.tone === "electric"
                  ? "bg-electric"
                  : item.tone === "leaf"
                  ? "bg-leaf"
                  : item.tone === "ink"
                  ? "bg-white/20"
                  : "bg-ocean"
              }`}
            />
            <p className="text-[13px] leading-relaxed text-white/85">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
