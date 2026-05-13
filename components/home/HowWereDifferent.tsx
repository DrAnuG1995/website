"use client";
import { motion } from "framer-motion";

const TRADITIONAL = [
  "20% agency cut",
  "Hours to onboard",
  "Outdated communication",
  "Stacks of paperwork",
  "High buy-out fees",
  "Misaligned hiring",
];

const STATDOCTOR = [
  "Highest rates in Australia",
  "Onboard in minutes",
  "User friendly digital platform",
  "Store all docs online",
  "No buy-out clauses",
  "Find the best fit",
];

export default function HowWereDifferent() {
  return (
    <section className="relative bg-white pt-12 pb-20 md:pt-16 md:pb-28 px-4 md:px-6 overflow-hidden">
      <div className="relative max-w-[1200px] mx-auto">
        {/* Flow diagram: the middleman thesis, visualised */}
        <FlowDiagram />

        <div className="text-center mt-16 md:mt-24 mb-10 md:mb-14">
          <h2 className="display text-[clamp(28px,4.5vw,56px)] leading-[1.0]">
            The way locuming{" "}
            <span className="italic text-ocean">should work</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7 items-start">
          <CompareCard
            variant="traditional"
            title="Traditional Hiring"
            items={TRADITIONAL}
          />
          <CompareCard
            variant="statdoctor"
            title="StatDoctor"
            items={STATDOCTOR}
          />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FLOW DIAGRAM — the agency vs direct comparison
   ============================================================ */

function FlowDiagram() {
  return (
    <div className="grid gap-5 md:gap-7">
      {/* Agency row */}
      <FlowRow
        label="Agency model"
        labelTone="muted"
        nodes={[
          { name: "Hospital", tone: "neutral" },
          { name: "Agency", tone: "warn", badge: "−25% cut" },
          { name: "Doctor", tone: "neutral" },
        ]}
        flows={[
          { amount: "$100/hr", tone: "neutral" },
          { amount: "$75/hr", tone: "warn" },
        ]}
        rowAccent="muted"
      />

      {/* StatDoctor row */}
      <FlowRow
        label="StatDoctor model"
        labelTone="ocean"
        nodes={[
          { name: "Hospital", tone: "ocean" },
          { name: "Doctor", tone: "ocean", badge: "100% rate" },
        ]}
        flows={[{ amount: "$100/hr", tone: "ocean" }]}
        rowAccent="ocean"
      />
    </div>
  );
}

type NodeTone = "neutral" | "warn" | "ocean";
type FlowTone = "neutral" | "warn" | "ocean";

function FlowRow({
  label,
  labelTone,
  nodes,
  flows,
  rowAccent,
}: {
  label: string;
  labelTone: "muted" | "ocean";
  nodes: { name: string; tone: NodeTone; badge?: string }[];
  flows: { amount: string; tone: FlowTone }[];
  rowAccent: "muted" | "ocean";
}) {
  const rowBg =
    rowAccent === "ocean"
      ? "bg-gradient-to-r from-ocean/[0.06] via-electric/[0.10] to-ocean/[0.06] border-ocean/20"
      : "bg-bone/50 border-ink/8";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
      className={`relative rounded-3xl border ${rowBg} px-4 md:px-8 py-6 md:py-8`}
    >
      <div className="mb-5 md:mb-6 text-center">
        <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] tracking-[0.22em] uppercase font-semibold ${
            labelTone === "ocean"
              ? "bg-ocean text-white"
              : "bg-ink/8 text-muted"
          }`}
        >
          {labelTone === "ocean" && (
            <span className="w-1.5 h-1.5 rounded-full bg-electric" />
          )}
          {label}
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-0">
        {nodes.map((node, i) => (
          <div key={node.name} className="contents">
            <FlowNode node={node} />
            {i < flows.length && (
              <FlowArrow amount={flows[i].amount} tone={flows[i].tone} />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function FlowNode({ node }: { node: { name: string; tone: NodeTone; badge?: string } }) {
  const styles: Record<NodeTone, string> = {
    neutral: "bg-white border-ink/12 text-ink",
    warn: "bg-white border-stat/40 text-ink shadow-[0_6px_24px_-12px_rgba(255,90,54,0.35)]",
    ocean: "bg-white border-ocean/25 text-ink shadow-[0_6px_24px_-12px_rgba(50,50,255,0.4)]",
  };

  return (
    <div className="relative shrink-0">
      <div
        className={`px-5 md:px-6 py-2.5 md:py-3 rounded-full border-2 ${styles[node.tone]} font-semibold text-[14px] md:text-[15px] min-w-[120px] md:min-w-[130px] text-center`}
      >
        {node.name}
      </div>
      {node.badge && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 -top-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] tracking-[0.18em] uppercase font-bold whitespace-nowrap ${
            node.tone === "warn"
              ? "bg-stat text-white"
              : "bg-electric text-ink"
          }`}
        >
          {node.badge}
        </div>
      )}
    </div>
  );
}

function FlowArrow({
  amount,
  tone,
}: {
  amount: string;
  tone: FlowTone;
}) {
  const colorClass: Record<FlowTone, string> = {
    neutral: "text-ink/45",
    warn: "text-stat",
    ocean: "text-ocean",
  };
  const labelBg: Record<FlowTone, string> = {
    neutral: "bg-white border-ink/12",
    warn: "bg-white border-stat/30",
    ocean: "bg-white border-ocean/25",
  };

  return (
    <div className={`flex flex-col md:flex-row items-center justify-center md:flex-1 gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-0 ${colorClass[tone]}`}>
      {/* Rate label as a pill — reads as the value being passed along, not
          as floating text disconnected from the line. */}
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full border ${labelBg[tone]} text-[10px] md:text-[11px] tracking-[0.18em] uppercase font-bold whitespace-nowrap`}
      >
        {amount}
      </span>
      {/* Clean SVG arrow — single icon, rotates 90° on mobile for vertical
          flow. CSS-border triangles rendered badly when rotated, so this
          is an explicit path that scales reliably. */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5 md:w-7 md:h-7 rotate-90 md:rotate-0 shrink-0"
        aria-hidden
      >
        <line x1="4" y1="12" x2="20" y2="12" />
        <polyline points="13 5 20 12 13 19" />
      </svg>
    </div>
  );
}

function CompareCard({
  variant,
  title,
  items,
}: {
  variant: "traditional" | "statdoctor";
  title: string;
  items: string[];
}) {
  const isStat = variant === "statdoctor";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
      className={`relative rounded-[28px] p-7 md:p-10 ${
        isStat
          ? "bg-white border border-ocean/10 shadow-[0_30px_80px_-20px_rgba(50,50,255,0.18)]"
          : "bg-lavender"
      }`}
    >
      {isStat ? <StethIcon /> : <BriefcaseIcon />}
      <h3
        className={`display text-[26px] md:text-[34px] leading-tight mt-6 md:mt-8 mb-6 md:mb-8 ${
          isStat ? "text-ocean" : "text-ink"
        }`}
      >
        {title}
      </h3>
      <ul className="space-y-4 md:space-y-5">
        {items.map((item, i) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: isStat ? 10 : -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: 0.1 + i * 0.05 }}
            className={`flex items-center gap-3 md:gap-4 text-[15px] md:text-[17px] ${
              isStat ? "text-ocean font-semibold" : "text-ink/85"
            }`}
          >
            {isStat ? <CheckCircle /> : <XCircle />}
            <span>{item}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

function BriefcaseIcon() {
  return (
    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-ink shadow-[0_8px_24px_-10px_rgba(26,26,46,0.5)] grid place-items-center text-white">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="2.5" y="7" width="19" height="13" rx="2.5" />
        <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
        <line x1="2.5" y1="12.5" x2="21.5" y2="12.5" />
      </svg>
    </div>
  );
}

function StethIcon() {
  return (
    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-ocean shadow-[0_8px_24px_-8px_rgba(50,50,255,0.6)] grid place-items-center text-white">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M4.5 3v6a4 4 0 008 0V3" />
        <path d="M4.5 3h1.5M11 3h1.5" />
        <path d="M8.5 13v3a5 5 0 0010 0v-1.5" />
        <circle cx="18.5" cy="12" r="2.2" />
      </svg>
    </div>
  );
}

function XCircle() {
  return (
    <span className="shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-full bg-ink/30 grid place-items-center text-white">
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        aria-hidden
      >
        <line x1="6" y1="6" x2="18" y2="18" />
        <line x1="18" y1="6" x2="6" y2="18" />
      </svg>
    </span>
  );
}

function CheckCircle() {
  return (
    <span className="shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-full bg-electric grid place-items-center text-ink">
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}
