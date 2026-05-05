"use client";
import { motion } from "framer-motion";
import FeatureShowcase from "@/components/home/FeatureShowcase";

export default function ForDoctorsClient() {
  const openDownload = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("open-download-modal"));
    }
  };

  return (
    <div className="bg-white text-ink">
      <section className="relative pt-48 md:pt-60 pb-4 md:pb-6 px-6">
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
              For doctors
            </div>
            <h1 className="display text-[clamp(36px,6vw,84px)] leading-[0.98]">
              Locum work,{" "}
              <span className="italic text-ocean">on your terms</span>.
            </h1>
            <p className="mt-5 text-muted max-w-xl mx-auto text-[15px] md:text-base leading-relaxed">
              Verified by AHPRA. Posted rate visible upfront. Paid in 48 hours.
              No agency reps, no contracts, no chasing.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={openDownload}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-ocean text-white text-sm font-semibold hover:bg-ink transition-colors"
                data-hover
              >
                Download the app
                <span aria-hidden>→</span>
              </button>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-ink/20 text-ink text-sm font-medium hover:bg-bone hover:border-ink transition-colors"
                data-hover
              >
                What's inside the app
              </a>
            </div>
          </motion.div>
        </div>
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

function PartnerNetwork() {
  // Show a curated sample of well-known partners across states, full list
  // lives on /partners. Keeps /for-doctors focused on conversion, not the
  // alphabetical wall.
  const SAMPLE = [
    "Bendigo Health",
    "Mater Private Brisbane",
    "Knox Private Hospital ED",
    "Hobart Private Hospital",
    "Tom Price Hospital",
    "Hollywood Private Hospital",
    "HEAL Urgent Care Newcastle",
    "Bundaberg Hospital",
  ];
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            {SAMPLE.map((name) => (
              <div
                key={name}
                className="rounded-2xl bg-white border border-ink/8 px-4 py-3 text-[13px] md:text-[14px] text-ink leading-snug text-center"
              >
                {name}
              </div>
            ))}
          </div>

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
