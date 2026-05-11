"use client";
import { motion } from "framer-motion";
import Counter from "@/components/Counter";

/* ============================================================
   /partners — doctor perks page.
   These are the brands StatDoctor doctors get discounts and
   priority access with. Frame: member benefits, not B2B ecosystem.
   Mirrors the home page design system: Cormorant display,
   italic-ocean accent, lavender card tint, rounded-3xl, eyebrow
   text-[10px] tracking-[0.22em] uppercase text-muted.
   ============================================================ */

type Perk = {
  brand: string;
  category: "Finance" | "Compliance" | "Career";
  blurb: string;
  value: string; // the actual member benefit
  accent: "ocean" | "electric" | "leaf";
};

const PERKS: Perk[] = [
  {
    brand: "Hnry",
    category: "Finance",
    blurb: "All-in-one tax, invoicing, and accounting for sole-trader doctors.",
    value: "First month free + priority onboarding",
    accent: "ocean",
  },
  {
    brand: "Acceptance Finance",
    category: "Finance",
    blurb: "Mortgage broking and lending built around medical professionals.",
    value: "No-fee broker review for SD members",
    accent: "ocean",
  },
  {
    brand: "By Invite Finance",
    category: "Finance",
    blurb: "Bespoke financing tailored for doctors at every career stage.",
    value: "Dedicated SD doctor concierge",
    accent: "ocean",
  },
  {
    brand: "CPD Home",
    category: "Compliance",
    blurb: "CPD tracking integrated with the College frameworks.",
    value: "Complimentary first-year membership",
    accent: "leaf",
  },
  {
    brand: "Validex",
    category: "Compliance",
    blurb: "Continuous credential verification and AHPRA monitoring.",
    value: "Free credential audit for SD doctors",
    accent: "leaf",
  },
  {
    brand: "Milford Specialist Recruitment",
    category: "Career",
    blurb: "Permanent specialist placements that complement locum work.",
    value: "Priority placement queue for SD members",
    accent: "electric",
  },
];

export default function PartnersClient() {
  return (
    <div className="bg-white text-ink">
      <Hero />
      <PerkGrid />
      <ClosingCTA />
    </div>
  );
}

/* ---------- HERO ---------- */
function Hero() {
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
            Doctor perks
          </div>
          <h1 className="display text-[clamp(36px,6vw,84px)] leading-[0.98]">
            Membership has its{" "}
            <span className="italic text-ocean">perks</span>.
          </h1>
          <p className="mt-5 text-muted max-w-xl mx-auto text-[15px] md:text-base leading-relaxed">
            StatDoctor doctors get discounts, priority access, and dedicated
            support across finance, compliance, and career — from the partners
            we&apos;d use ourselves.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 md:mt-14 grid grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto"
        >
          <HeroStat to={6} label="Partner brands" />
          <HeroStat to={3} label="Perk categories" />
          <HeroStat to={1} label="Membership" />
        </motion.div>
      </div>
    </section>
  );
}

function HeroStat({
  to,
  suffix = "",
  label,
}: {
  to: number;
  suffix?: string;
  label: string;
}) {
  return (
    <div className="rounded-3xl bg-lavender border border-ocean/10 px-4 py-5 md:py-6 text-center">
      <div className="display text-[clamp(28px,3.5vw,44px)] leading-none text-ink tabular-nums">
        <Counter to={to} suffix={suffix} duration={1.6} />
      </div>
      <div className="mt-2 text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-muted">
        {label}
      </div>
    </div>
  );
}

/* ---------- PERK GRID ---------- */
function PerkGrid() {
  return (
    <section className="relative bg-white py-16 md:py-20 px-6">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-10 md:mb-12"
        >
          <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">
            What you get
          </div>
          <h2 className="display text-[clamp(28px,4.5vw,56px)] leading-[1.0]">
            Every perk,{" "}
            <span className="italic text-ocean">unlocked</span> with your
            account.
          </h2>
          <p className="mt-4 text-muted max-w-xl mx-auto text-[14px] md:text-[15px] leading-relaxed">
            One membership covers the lot. Activate from inside the app — no
            promo codes, no hoops.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {PERKS.map((p, i) => (
            <PerkCard key={p.brand} perk={p} delay={i * 0.05} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PerkCard({ perk, delay }: { perk: Perk; delay: number }) {
  const dot =
    perk.accent === "ocean"
      ? "bg-ocean"
      : perk.accent === "electric"
      ? "bg-electric"
      : "bg-leaf";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className="rounded-3xl bg-lavender border border-ocean/10 p-6 md:p-7 flex flex-col"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        <span className="text-[10px] tracking-[0.22em] uppercase font-semibold text-ink">
          {perk.category}
        </span>
      </div>
      <h3 className="display text-[22px] md:text-[26px] leading-[1.15] text-ink mb-3">
        {perk.brand}
      </h3>
      <p className="text-[13px] md:text-[14px] text-muted leading-relaxed mb-5">
        {perk.blurb}
      </p>
      <div className="mt-auto rounded-2xl bg-white border border-ink/10 px-4 py-3.5">
        <div className="text-[10px] tracking-[0.2em] uppercase text-muted mb-1">
          Member perk
        </div>
        <div className="text-[14px] md:text-[15px] text-ink font-medium leading-snug">
          {perk.value}
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- CLOSING CTA ---------- */
function ClosingCTA() {
  return (
    <section className="relative bg-white">
      <div className="relative max-w-[1100px] mx-auto px-6 py-14 md:py-16 text-center">
        <h2 className="display text-[clamp(28px,4.5vw,56px)] leading-[1.0] max-w-3xl mx-auto">
          Want your brand in front of Australia&apos;s{" "}
          <span className="italic text-ocean">locum doctors</span>?
        </h2>
        <p className="mt-4 text-muted max-w-xl mx-auto text-[14px] md:text-[15px] leading-relaxed">
          We partner with brands that genuinely make a working doctor&apos;s
          life better. Get in touch.
        </p>
        <a
          href="/contact"
          className="mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-white text-sm font-semibold hover:bg-ocean transition-colors"
          data-hover
        >
          Become a perks partner
          <span aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}
