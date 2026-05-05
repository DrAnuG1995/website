"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Counter from "@/components/Counter";

/* ============================================================
   /hospitals, sales landing page for hospital admins.
   Mirrors the home page design system (eyebrows, italic-ocean
   accent, Cormorant display, lavender card tint, rounded-3xl).
   Real dashboard screenshots from the StatHospital admin product
   live in /public/screens/stathospital-*.
   ============================================================ */

export default function HospitalsClient() {
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
      <Hero onContact={goContact} />
      <HowItWorks />
      <Comparison />
      <Pricing onContact={goContact} />
      <HospitalFAQ />
      <ClosingCTA onContact={goContact} />
    </div>
  );
}

/* ---------- HERO ---------- */
function Hero({ onContact }: { onContact: () => void }) {
  const stats = [
    { to: 60, suffix: "+", label: "Partner clinics & hospitals" },
    { to: 300, suffix: "+", label: "Verified Australian doctors" },
    { to: 75, suffix: "%", label: "Cheaper than agency fees" },
  ];
  return (
    <section className="relative pt-32 md:pt-36 pb-12 md:pb-16 px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(40% 40% at 80% 20%, rgba(50,50,255,0.10), transparent 70%), radial-gradient(40% 40% at 15% 80%, rgba(205,227,93,0.18), transparent 70%)",
        }}
      />
      <div className="relative max-w-[1100px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">
            For hospitals
          </div>
          <h1 className="display text-[clamp(36px,6vw,84px)] leading-[0.98]">
            Fill shifts faster.{" "}
            <span className="italic text-ocean">Pay agencies less</span>.
          </h1>
          <p className="mt-5 text-muted max-w-xl mx-auto text-[15px] md:text-base leading-relaxed">
            Post a shift directly to 300+ verified Australian doctors. Review
            credentials in seconds, confirm in one tap, settle in 48 hours, no
            recruiter, no markup, no contract.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onContact}
              className="inline-flex items-center justify-center gap-2 w-[200px] px-5 py-3 rounded-full bg-ocean text-white text-sm font-semibold hover:bg-ink transition-colors"
              data-hover
            >
              Book a 15-min demo
              <span aria-hidden>→</span>
            </button>
            <a
              href="#how"
              className="inline-flex items-center justify-center gap-2 w-[200px] px-5 py-3 rounded-full border border-ink/20 text-ink text-sm font-medium hover:bg-bone hover:border-ink transition-colors"
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
              className="rounded-3xl bg-lavender border border-ocean/10 px-6 py-7 md:py-8"
            >
              <div className="display text-[clamp(40px,5vw,64px)] leading-none text-ink tabular-nums">
                <Counter to={s.to} suffix={s.suffix} duration={1.6 + i * 0.2} />
              </div>
              <div className="mt-3 text-[12px] md:text-[13px] text-muted leading-snug">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
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
    body: "Specialty, date, hours, rate, location. Live to 300+ verified doctors.",
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
      {/* Header, normal flow, scrolls past as the sticky stack pins below */}
      <div className="relative max-w-[1100px] mx-auto px-6 pt-16 md:pt-24 pb-8 md:pb-14 text-center">
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
        <div className="sticky top-0 h-screen flex items-center overflow-hidden px-4 md:px-6">
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

/* ---------- COMPARISON ---------- */
const COMPARE: { dim: string; agency: string; sd: string }[] = [
  { dim: "Agency fee", agency: "15–25%", sd: "0%" },
  { dim: "Time to fill", agency: "2–10 days", sd: "2–48 hours" },
  { dim: "Credential check", agency: "Manual, ongoing", sd: "Continuous & automated" },
  { dim: "Lock-in contract", agency: "12+ months", sd: "None" },
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
            One simple price.{" "}
            <span className="italic text-ocean">Per accepted shift</span>.
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
              Pay-as-you-go
            </div>
            <div className="display text-[clamp(48px,5vw,64px)] leading-none">
              $99
              <span className="text-base text-muted ml-1">/shift</span>
            </div>
            <p className="mt-3 text-[13px] md:text-[14px] text-muted leading-relaxed">
              Charged only when a doctor accepts a posted shift. No accept, no
              fee. No subscription, no minimums.
            </p>
            <ul className="mt-5 space-y-2.5 text-[13px] md:text-[14px] text-ink/85 flex-1">
              <Bullet>Unlimited postings</Bullet>
              <Bullet>Verified, AHPRA-checked doctors</Bullet>
              <Bullet>Auto credential refresh</Bullet>
              <Bullet>Email + in-app notifications</Bullet>
            </ul>
            <button
              onClick={onContact}
              className="mt-6 inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full bg-ocean text-white text-sm font-semibold hover:bg-ink transition-colors"
              data-hover
            >
              Start posting
              <span aria-hidden>→</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative rounded-3xl bg-ink text-bone p-7 md:p-8 flex flex-col"
          >
            <div className="text-[10px] tracking-[0.22em] uppercase text-bone/60 mb-3">
              Network · Health districts
            </div>
            <div className="display text-[clamp(40px,4.5vw,56px)] leading-none">
              Custom
            </div>
            <p className="mt-3 text-[13px] md:text-[14px] text-bone/70 leading-relaxed">
              Multi-site, multi-admin organisations. Volume pricing, dedicated
              support, integrations with your roster system.
            </p>
            <ul className="mt-5 space-y-2.5 text-[13px] md:text-[14px] text-bone/85 flex-1">
              <Bullet dark>Volume rate per accepted shift</Bullet>
              <Bullet dark>Dedicated account manager</Bullet>
              <Bullet dark>Roster integration (CSV, API)</Bullet>
              <Bullet dark>SLAs and reporting</Bullet>
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

/* ---------- FAQ ---------- */
const HOSPITAL_FAQ: { q: string; a: string }[] = [
  {
    q: "Is there a contract or onboarding fee?",
    a: "No contract. No onboarding fee. You can post your first shift within 30 minutes of creating an account.",
  },
  {
    q: "How are doctors verified?",
    a: "Every doctor uploads AHPRA registration, indemnity, and CV. We verify on signup and refresh checks continuously. You see verification status on every applicant.",
  },
  {
    q: "What's the platform fee, exactly?",
    a: "$99 per accepted shift on pay-as-you-go. Volume pricing for districts and large networks, talk to us. No fees on unfilled posts, no subscription, no per-seat charges.",
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
    a: "Yes, no agency placement fees. If a hospital and doctor want to formalise a permanent role, that's between you and them.",
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
