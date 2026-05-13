"use client";
import Link from "next/link";
import { motion } from "framer-motion";

/* ============================================================
   /blog — Journal placeholder.
   The Journal is paused while Anu sets up the publishing workflow.
   This page intentionally has no live content; it sits as an
   editorial "Coming soon" beat so the link in the nav still resolves
   to something on-brand rather than a 404. Restore the previous
   posts-driven listing once the new pipeline is wired.
   ============================================================ */

export default function BlogClient() {
  return (
    <section className="relative min-h-screen bg-white overflow-hidden flex items-center pt-28 md:pt-32 pb-20 md:pb-28 px-6">
      {/* Soft lavender-to-white gradient backdrop, anchored at the
          bottom so the top of the page reads cleanly under the nav. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(239,237,255,0.55) 55%, rgba(229,225,255,0.75) 100%)",
        }}
      />

      <div className="relative max-w-[1100px] mx-auto w-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
          }}
          className="text-center"
        >
          <motion.div
            variants={beat}
            className="inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-muted mb-8"
          >
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-electric opacity-75 animate-ping-slow" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-electric" />
            </span>
            The Journal
          </motion.div>

          {/* Hero numeric/typographic moment — oversized italic "soon"
              flanked by stacked period punctuation, in the spirit of a
              magazine masthead. */}
          <motion.div
            variants={beat}
            aria-hidden
            className="relative mx-auto mb-6 md:mb-8"
          >
            <div
              className="display leading-none text-ink select-none"
              style={{ fontSize: "clamp(120px, 22vw, 280px)" }}
            >
              <span className="italic text-ocean">soon</span>
              <span className="text-ink">.</span>
            </div>
          </motion.div>

          <motion.h1
            variants={beat}
            className="display text-[clamp(28px,4.5vw,56px)] leading-[1.02] max-w-2xl mx-auto"
          >
            The Journal is on its way.
          </motion.h1>

          <motion.p
            variants={beat}
            className="mt-6 text-ink/70 max-w-xl mx-auto text-[15px] md:text-[17px] leading-relaxed"
          >
            Reporting from the locum frontline, in the founder&apos;s voice.
            Pay rates, AHPRA, hospital systems, and the working week of an
            Australian locum doctor. We&apos;re writing the first issue now.
          </motion.p>

          <motion.div
            variants={beat}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-ocean text-white text-sm font-semibold hover:bg-ink transition-colors"
              data-hover
            >
              Back to home
              <span aria-hidden>→</span>
            </Link>
            <a
              href="mailto:anu@statdoctor.net?subject=Notify%20me%20when%20The%20Journal%20launches"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-ink/20 text-ink text-sm font-medium hover:bg-ink hover:text-white hover:border-ink transition-colors"
              data-hover
            >
              Email me when it&apos;s live
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

const beat = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] },
  },
};
