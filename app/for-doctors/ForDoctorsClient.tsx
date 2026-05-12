"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FeatureShowcase from "@/components/home/FeatureShowcase";

export default function ForDoctorsClient() {
  const openDownload = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("open-download-modal"));
    }
  };

  return (
    <div className="bg-white text-ink">
      {/* Cinematic video hero — full-bleed footage of a doctor moving
          freely across Australia, with overlay copy and a download CTA.
          Drop the source files at /doctors-hero.mp4 (h264, ~5MB) and
          /doctors-hero-poster.jpg for instant first paint. The poster
          shows immediately while the video buffers. */}
      <section className="relative w-full h-[100svh] min-h-[560px] max-h-[860px] overflow-hidden bg-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/doctors-hero.mp4"
          poster="/doctors-hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        />
        {/* Gradient overlay so the white text reads against any frame.
            Stronger at the bottom where the copy sits. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/20 to-ink/75"
        />

        <div className="relative h-full max-w-[1200px] mx-auto px-6 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1], delay: 0.2 }}
          >
            <div className="text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-bone/80 mb-5 md:mb-6">
              For doctors
            </div>
            <h1 className="display text-white text-[clamp(44px,8vw,112px)] leading-[0.98] tracking-tight mx-auto max-w-[14ch]">
              Locum work,{" "}
              <span className="italic text-electric">on your terms.</span>
            </h1>
            <p className="mt-6 md:mt-8 mx-auto max-w-[560px] text-bone/85 text-[15px] md:text-[18px] leading-relaxed">
              Pick the shifts that fit your life. Posted rate visible upfront,
              paid in 48 hours, no agency in the middle.
            </p>
            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={openDownload}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-electric text-ink text-sm md:text-base font-semibold hover:bg-white transition-colors"
                data-hover
              >
                Download the app
                <span aria-hidden>→</span>
              </button>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-bone/40 text-bone text-sm md:text-base font-medium hover:bg-bone/10 hover:border-bone transition-colors"
                data-hover
              >
                What&apos;s inside the app
              </a>
            </div>
          </motion.div>
        </div>

        {/* Subtle scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 text-bone/60 text-[10px] tracking-[0.3em] uppercase hidden md:flex items-center gap-2"
        >
          Scroll
          <motion.span
            className="block w-px h-5 bg-bone/60"
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
          />
        </motion.div>
      </section>

      {/* Section break: caption sits horizontally centered, with a vertical
          rail beneath it. A light glides top→bottom along the rail to cue
          the reader to keep scrolling. */}
      <div className="relative max-w-[1100px] mx-auto px-6 pt-16 pb-4 md:pt-24 md:pb-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-[10px] tracking-[0.22em] uppercase text-muted">
            Inside the app
          </span>
          <div aria-hidden className="relative w-px h-12 md:h-14 bg-ink/10 overflow-hidden">
            <motion.span
              className="absolute left-1/2 -translate-x-1/2 w-[3px] h-5 rounded-full"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(50,50,255,0.95), transparent)",
                boxShadow: "0 0 10px rgba(50,50,255,0.55)",
              }}
              initial={{ top: -20, opacity: 0 }}
              animate={{
                top: [-20, 56],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: [0.4, 0, 0.6, 1],
                times: [0, 0.18, 0.82, 1],
                repeatDelay: 0.7,
              }}
            />
          </div>
        </div>
      </div>

      <div id="features">
        <FeatureShowcase />
      </div>

      <PartnerNetwork />

      <section className="relative bg-white">
        <div className="relative max-w-[1100px] mx-auto px-6 py-12 md:py-14 text-center">
          <h2 className="display text-[clamp(28px,4.5vw,56px)] leading-[1.0] max-w-3xl mx-auto">
            Ready when you are.{" "}
            <span className="italic text-ocean">Free on iOS &amp; Android</span>.
          </h2>
          <p className="mt-4 text-muted max-w-xl mx-auto text-[14px] md:text-[15px] leading-relaxed">
            Sign up takes a few minutes. AHPRA, indemnity, CV, uploaded once,
            verified overnight, applied with one tap forever after.
          </p>
          <button
            onClick={openDownload}
            className="mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-white text-sm font-semibold hover:bg-ocean transition-colors"
            data-hover
          >
            Get the app
            <span aria-hidden>→</span>
          </button>
        </div>
      </section>
    </div>
  );
}

type AusState = "VIC" | "NSW" | "QLD" | "WA" | "SA" | "TAS" | "ACT" | "NT";

const STATES: { code: AusState; label: string }[] = [
  { code: "VIC", label: "Victoria" },
  { code: "NSW", label: "New South Wales" },
  { code: "QLD", label: "Queensland" },
  { code: "WA", label: "Western Australia" },
  { code: "SA", label: "South Australia" },
  { code: "TAS", label: "Tasmania" },
  { code: "ACT", label: "ACT" },
  { code: "NT", label: "Northern Territory" },
];

const PARTNERS: { name: string; state: AusState }[] = [
  // VIC
  { name: "Alexandra District Health", state: "VIC" },
  { name: "Bairnsdale Regional Health Service", state: "VIC" },
  { name: "Bendigo & District Aboriginal Co-operative", state: "VIC" },
  { name: "Bendigo Health", state: "VIC" },
  { name: "Border Urgent Care Centre", state: "VIC" },
  { name: "CBD Doctors Melbourne", state: "VIC" },
  { name: "Colac Area Health", state: "VIC" },
  { name: "Echuca Regional Health", state: "VIC" },
  { name: "Knox Private Hospital ED", state: "VIC" },
  { name: "Merri-bek Family Doctors", state: "VIC" },
  { name: "Portland District Health", state: "VIC" },
  { name: "Swan Hill District Health", state: "VIC" },
  { name: "Yarrawonga Health", state: "VIC" },
  // NSW
  { name: "HEAL Urgent Care Newcastle", state: "NSW" },
  { name: "Woodburn Health GP Clinic", state: "NSW" },
  { name: "Central West Medical Centre", state: "NSW" },
  // QLD
  { name: "Biggenden Multipurpose Health Centre", state: "QLD" },
  { name: "Bundaberg Hospital", state: "QLD" },
  { name: "Childers Hospital", state: "QLD" },
  { name: "Eidsvold Multipurpose Health Service", state: "QLD" },
  { name: "Gayndah Hospital", state: "QLD" },
  { name: "Gin Gin Hospital", state: "QLD" },
  { name: "Hervey Bay Hospital", state: "QLD" },
  { name: "Maryborough Hospital", state: "QLD" },
  { name: "Mater Private Brisbane", state: "QLD" },
  { name: "Mater Private Mackay", state: "QLD" },
  { name: "Mater Private Rockhampton", state: "QLD" },
  { name: "Mater Private Townsville", state: "QLD" },
  { name: "Monto Hospital", state: "QLD" },
  { name: "Noosa Private Hospital", state: "QLD" },
  { name: "Friendly Society Private Bundaberg", state: "QLD" },
  // WA
  { name: "Hollywood Private Hospital", state: "WA" },
  { name: "Kalgoorlie Hospital", state: "WA" },
  { name: "Kutjungka Regional Clinic", state: "WA" },
  { name: "Paraburdoo Medical Centre", state: "WA" },
  { name: "Tom Price Hospital", state: "WA" },
  // TAS
  { name: "Hobart Private Hospital", state: "TAS" },
  // ACT
  { name: "Fisher Family Practice", state: "ACT" },
  { name: "Holder Family Practice", state: "ACT" },
  { name: "Kingston Plaza Medical Centre", state: "ACT" },
  // Uncertain state — best-guess pending confirmation
  { name: "GN Medical Centre", state: "NSW" },
  { name: "Mercy Family Doctors", state: "VIC" },
  { name: "MyFast Medical", state: "VIC" },
  { name: "Saint Lukes Medical Centre", state: "VIC" },
];

function PartnerNetwork() {
  const [filter, setFilter] = useState<AusState | "ALL">("ALL");
  const visible =
    filter === "ALL" ? PARTNERS : PARTNERS.filter((p) => p.state === filter);
  const countFor = (code: AusState) =>
    PARTNERS.filter((p) => p.state === code).length;

  return (
    <section className="relative bg-white py-12 md:py-14 px-6">
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl bg-lavender border border-ocean/10 p-7 md:p-10"
        >
          <div className="text-center max-w-2xl mx-auto mb-6">
            <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">
              The network
            </div>
            <h2 className="display text-[clamp(24px,3.5vw,40px)] leading-[1.05]">
              Filling shifts at 60+ partner clinics{" "}
              <span className="italic text-ocean">across Australia</span>.
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <StatePill
              active={filter === "ALL"}
              onClick={() => setFilter("ALL")}
              label="All states"
            />
            {STATES.map((s) => {
              if (countFor(s.code) === 0) return null;
              return (
                <StatePill
                  key={s.code}
                  active={filter === s.code}
                  onClick={() => setFilter(s.code)}
                  label={s.label}
                />
              );
            })}
          </div>

          <motion.div
            layout
            className="flex flex-wrap justify-center gap-3 md:gap-4 mb-6"
          >
            <AnimatePresence mode="popLayout">
              {visible.map((p) => (
                <motion.div
                  key={p.name}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                  className="basis-[calc(50%-6px)] md:basis-[calc(25%-12px)] rounded-2xl bg-white border border-ink/8 px-4 py-4 flex flex-col items-center justify-center text-center min-h-[78px]"
                >
                  <div className="text-[13px] md:text-[14px] text-ink leading-snug">
                    {p.name}
                  </div>
                  <div className="mt-1 text-[10px] tracking-[0.15em] uppercase text-muted">
                    {p.state}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="text-center">
            <a
              href="/partners"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-ink/15 text-ink text-[13px] font-medium hover:bg-ink hover:text-white hover:border-ink transition-colors"
              data-hover
            >
              Browse the full network
              <span aria-hidden>→</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatePill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-[12px] md:text-[13px] font-medium border transition-colors ${
        active
          ? "bg-ocean text-white border-ocean"
          : "bg-white text-ink border-ink/15 hover:border-ink/40"
      }`}
      data-hover
    >
      {label}
    </button>
  );
}
