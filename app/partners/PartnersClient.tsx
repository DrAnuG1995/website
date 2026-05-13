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
  // Optional SD-specific member offer. Only shown when present. Today
  // CPD Home is the only partner with an offer; the rest are curated
  // relationships without a discount code.
  value?: string;
  accent: "ocean" | "electric" | "leaf";
  // Outbound URL to the partner's website. Cards are wrapped in an
  // anchor so doctors can click straight through. Links taken directly
  // from statdoctor.app/partners — keep these in lock-step.
  href: string;
  // Brand logo. Hosted on the Webflow CDN under the partners-site asset
  // bucket (68dfbc30660b4fef0269fe47) — same images the live site uses.
  logo: string;
};

// Descriptive blurbs lifted from the live statdoctor.app/partners page so
// the per-card copy reads consistently with the existing brand pages.
const PERKS: Perk[] = [
  {
    brand: "Hnry",
    category: "Finance",
    blurb:
      "Hnry simplifies finances for independent doctors. Tax, GST, invoicing, and compliance are handled automatically in real time. No spreadsheets or surprises, just clear insight into what you earn and owe, so you can focus on your work, not admin.",
    accent: "ocean",
    href: "https://hnry.com.au/",
    logo: "https://cdn.prod.website-files.com/68dfbc30660b4fef0269fe47/696f628eb419d93c7b03ea7e_HNRY-img.png",
  },
  {
    brand: "Acceptance Finance",
    category: "Finance",
    blurb:
      "Acceptance Finance is a Melbourne-based mortgage broker helping clients across Australia. They compare lenders to secure the right loan for homes, investments, SMSFs, refinancing, and more, managing the entire process from application to approval.",
    accent: "ocean",
    href: "https://www.acceptancefinance.com.au/",
    logo: "https://cdn.prod.website-files.com/68dfbc30660b4fef0269fe47/696f62a5721564e39d24f18f_Acceptance-Finance.png",
  },
  {
    brand: "By Invite Finance",
    category: "Finance",
    blurb:
      "By Invite Finance creates tailored lending solutions for locum doctors. With deep knowledge of locum income and lending structures, they manage the process end-to-end, helping with home purchases, investments, clinics, and SMSF property finance.",
    accent: "ocean",
    href: "https://byinvitefinance.com.au/",
    logo: "https://cdn.prod.website-files.com/68dfbc30660b4fef0269fe47/69810cc5f360268b2d220e80_BI_LOGO_.png",
  },
  {
    brand: "CPD Home",
    category: "Compliance",
    blurb:
      "CPD Home provides practical, high-quality CPD designed for real medical practice. From mandatory requirements to lifelong learning, it supports how doctors actually work, with relevant education that fits into busy professional lives.",
    value: "Get 10% off AMA CPD Home by using code SD 10",
    accent: "leaf",
    href: "https://www.cpdhome.org.au/",
    logo: "https://cdn.prod.website-files.com/68dfbc30660b4fef0269fe47/696f6471905de39418bb2920_CPD-Home.png",
  },
  {
    brand: "Validex",
    category: "Compliance",
    blurb:
      "Validex provides national criminal history checks for doctors, nurses, allied health, and aged care workers. Identity is verified digitally using government document validation and live facial matching through TrueVault.",
    accent: "leaf",
    href: "https://validex.com.au/medical.html?utm_source=statdoctor&utm_medium=referral&utm_campaign=medical_checks",
    logo: "https://cdn.prod.website-files.com/68dfbc30660b4fef0269fe47/69b3e148ccb2494596b44ad9_img-26420503-deff-4423-a6d8-94bcee10777c%20(1).png",
  },
  {
    brand: "Milford Specialist Recruitment",
    category: "Career",
    blurb:
      "Milford Specialist Recruitment focuses on permanent doctor placements across New Zealand. Their approach is personal and thoughtful, built on honest conversations, careful matching, and long-term relationships, not mass placements or pressure tactics.",
    accent: "electric",
    href: "https://www.milfordspecialistrecruitment.com/",
    logo: "https://cdn.prod.website-files.com/68dfbc30660b4fef0269fe47/696f63cc4192740a9a92bd6f_Milford-Specialist.png",
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
          <h1 className="display text-[clamp(40px,6.5vw,88px)] leading-[0.98]">
            Membership has its{" "}
            <span className="italic text-ocean">perks</span>.
          </h1>
          <p className="mt-5 text-muted max-w-xl mx-auto text-[15px] md:text-base leading-relaxed">
            StatDoctor doctors get discounts, priority access, and dedicated
            support across finance, compliance, and career, from the partners
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
            One membership covers the lot. Activate from inside the app, no
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
    <motion.a
      href={perk.href}
      target="_blank"
      rel="noopener noreferrer"
      data-hover
      aria-label={`Visit ${perk.brand}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className="group rounded-3xl bg-lavender border border-ocean/10 p-6 md:p-7 flex flex-col hover:border-ocean/30 hover:shadow-[0_20px_50px_-25px_rgba(50,50,255,0.25)] transition-[border-color,box-shadow,transform] hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        <span className="text-[10px] tracking-[0.22em] uppercase font-semibold text-ink">
          {perk.category}
        </span>
      </div>

      {/* Brand logo. White rounded slate so logos with light/transparent
          backgrounds stay legible on the lavender card. Fixed height so
          every card's logo block has the same vertical weight regardless
          of the logo's natural aspect ratio. */}
      <div className="rounded-2xl bg-white border border-ink/10 px-5 py-5 mb-4 flex items-center justify-center min-h-[96px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={perk.logo}
          alt={`${perk.brand} logo`}
          loading="lazy"
          decoding="async"
          className="max-h-[60px] md:max-h-[64px] w-auto object-contain"
        />
      </div>

      <h3 className="display text-[22px] md:text-[26px] leading-[1.15] text-ink mb-3 group-hover:text-ocean transition-colors">
        {perk.brand}
      </h3>
      <p className="text-[13px] md:text-[14px] text-muted leading-relaxed mb-5 flex-1">
        {perk.blurb}
      </p>

      {/* Member-perk slate. Rendered only for partners with a real SD
          offer (today: CPD Home). */}
      {perk.value && (
        <div className="mb-4 rounded-2xl bg-white border border-ink/10 px-4 py-3.5">
          <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-1">
            Member perk
          </div>
          <div className="text-[14px] md:text-[15px] text-ink font-medium leading-snug">
            {perk.value}
          </div>
        </div>
      )}

      {/* Visit-link affordance: small arrow row at the bottom that
          telegraphs the whole card is clickable without competing with
          the perk value. */}
      <div className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase font-semibold text-muted group-hover:text-ocean transition-colors">
        Visit
        <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </div>
    </motion.a>
  );
}

/* ---------- CLOSING CTA ---------- */
function ClosingCTA() {
  return (
    <section className="relative bg-white">
      <div className="relative max-w-[1100px] mx-auto px-6 py-14 md:py-16 text-center">
        <h2 className="display text-[clamp(28px,4.5vw,56px)] leading-[1.0] max-w-3xl mx-auto">
          Want your brand in front of Australia&apos;s{" "}
          <span className="italic text-ocean">doctors</span>?
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
