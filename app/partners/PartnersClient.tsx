"use client";
import { motion } from "framer-motion";
import { HOSPITALS } from "@/components/home/hospitals";
import Counter from "@/components/Counter";

/* ============================================================
   /partners, the network page.
   Mirrors the home page design system: Cormorant display,
   italic-ocean accent, lavender card tint, rounded-3xl, eyebrow
   text-[10px] tracking-[0.22em] uppercase text-muted.
   ============================================================ */

type EcosystemPartner = {
  name: string;
  blurb: string;
};

const FINANCE: EcosystemPartner[] = [
  { name: "Hnry", blurb: "All-in-one tax, invoicing, and accounting for sole-trader doctors." },
  { name: "Acceptance Finance", blurb: "Mortgage broking and lending for medical professionals." },
  { name: "By Invite Finance", blurb: "Bespoke financing solutions tailored for doctors." },
];

const COMPLIANCE: EcosystemPartner[] = [
  { name: "CPD Home", blurb: "CPD tracking and compliance, integrated with the College frameworks." },
  { name: "Validex", blurb: "Continuous credential verification and AHPRA monitoring." },
];

const RECRUITMENT: EcosystemPartner[] = [
  { name: "Milford Specialist Recruitment", blurb: "Permanent specialist placements that complement locum work." },
];

export default function PartnersClient() {
  return (
    <div className="bg-white text-ink">
      <Hero />
      <HospitalPartners />
      <EcosystemPartners />
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
            The network
          </div>
          <h1 className="display text-[clamp(36px,6vw,84px)] leading-[0.98]">
            60+ partners.{" "}
            <span className="italic text-ocean">Every state</span>.
          </h1>
          <p className="mt-5 text-muted max-w-xl mx-auto text-[15px] md:text-base leading-relaxed">
            From metro tertiary hospitals to remote rural clinics, with finance,
            compliance, and credentialing partners that keep working doctors
            covered end-to-end.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 md:mt-14 grid grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto"
        >
          <HeroStat to={60} suffix="+" label="Partner clinics" />
          <HeroStat to={6} label="States" />
          <HeroStat to={300} suffix="+" label="Verified doctors" />
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

/* ---------- HOSPITAL PARTNERS ---------- */
function HospitalPartners() {
  // Sort alphabetically and group by state for at-a-glance scanning.
  const sorted = [...HOSPITALS].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <section className="relative bg-white py-12 md:py-16 px-6">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-8"
        >
          <div className="text-[10px] tracking-[0.22em] uppercase text-muted">
            Healthcare partners · tertiary, regional, private, GP
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-3xl bg-lavender border border-ocean/10 p-6 md:p-8"
        >
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-x-8 gap-y-2">
            {sorted.map((h) => (
              <div
                key={h.name}
                className="break-inside-avoid mb-2.5 flex items-baseline gap-2"
              >
                <span className="text-[14px] md:text-[15px] text-ink leading-snug">
                  {h.name}
                </span>
                <span className="ml-auto text-[10px] tracking-[0.2em] uppercase text-muted shrink-0">
                  {h.state}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- ECOSYSTEM PARTNERS ---------- */
function EcosystemPartners() {
  const groups: { eyebrow: string; title: string; partners: EcosystemPartner[]; accent: "ocean" | "electric" | "leaf" }[] = [
    {
      eyebrow: "Finance",
      title: "Tax, invoicing, and lending",
      partners: FINANCE,
      accent: "ocean",
    },
    {
      eyebrow: "Compliance",
      title: "CPD and credentialing",
      partners: COMPLIANCE,
      accent: "leaf",
    },
    {
      eyebrow: "Recruitment",
      title: "Specialist placements",
      partners: RECRUITMENT,
      accent: "electric",
    },
  ];

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
            Ecosystem
          </div>
          <h2 className="display text-[clamp(28px,4.5vw,56px)] leading-[1.0]">
            The partners that{" "}
            <span className="italic text-ocean">make it work</span>.
          </h2>
          <p className="mt-4 text-muted max-w-xl mx-auto text-[14px] md:text-[15px] leading-relaxed">
            Beyond hospitals: finance, compliance, and credentialing partners
            that cover working doctors end-to-end.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {groups.map((g) => (
            <EcosystemCard key={g.eyebrow} group={g} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EcosystemCard({
  group,
}: {
  group: {
    eyebrow: string;
    title: string;
    partners: EcosystemPartner[];
    accent: "ocean" | "electric" | "leaf";
  };
}) {
  const dot =
    group.accent === "ocean"
      ? "bg-ocean"
      : group.accent === "electric"
      ? "bg-electric"
      : "bg-leaf";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      className="rounded-3xl bg-lavender border border-ocean/10 p-6 md:p-7 flex flex-col"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        <span className="text-[10px] tracking-[0.22em] uppercase font-semibold text-ink">
          {group.eyebrow}
        </span>
      </div>
      <h3 className="display text-[20px] md:text-[24px] leading-[1.15] text-ink mb-5">
        {group.title}
      </h3>
      <ul className="space-y-4 flex-1">
        {group.partners.map((p) => (
          <li key={p.name} className="rounded-2xl bg-white border border-ink/8 px-4 py-3.5">
            <div className="display text-[15px] md:text-[16px] text-ink leading-tight">
              {p.name}
            </div>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-muted leading-relaxed">
              {p.blurb}
            </p>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ---------- CLOSING CTA ---------- */
function ClosingCTA() {
  return (
    <section className="relative bg-white">
      <div className="relative max-w-[1100px] mx-auto px-6 py-14 md:py-16 text-center">
        <h2 className="display text-[clamp(28px,4.5vw,56px)] leading-[1.0] max-w-3xl mx-auto">
          Add your team to the{" "}
          <span className="italic text-ocean">list</span>.
        </h2>
        <p className="mt-4 text-muted max-w-xl mx-auto text-[14px] md:text-[15px] leading-relaxed">
          Hospital, clinic, finance, compliance, or credentialing partner, get
          in touch.
        </p>
        <a
          href="/contact"
          className="mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-white text-sm font-semibold hover:bg-ocean transition-colors"
          data-hover
        >
          Become a partner
          <span aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}
