"use client";
import Link from "next/link";
import { motion } from "framer-motion";

/* ============================================================
   Site-wide 404.
   Same editorial style as /blog (Coming Soon): minimal centered
   layout, soft lavender gradient backdrop, oversized italic
   Cormorant word as the hero, headline + body + CTA stack.
   ============================================================ */

export default function NotFound() {
  return (
    <section className="relative min-h-screen bg-white overflow-hidden flex items-center pt-28 md:pt-32 pb-20 md:pb-28 px-6">
      {/* Soft lavender-to-white gradient backdrop, anchored at the
          bottom so the nav reads cleanly under white. */}
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
            404
          </motion.div>

          <motion.div
            variants={beat}
            aria-hidden
            className="relative mx-auto mb-6 md:mb-8"
          >
            <div
              className="display leading-none text-ink select-none"
              style={{ fontSize: "clamp(120px, 22vw, 280px)" }}
            >
              <span className="italic text-ocean">lost</span>
              <span className="text-ink">.</span>
            </div>
          </motion.div>

          <motion.h1
            variants={beat}
            className="display text-[clamp(28px,4.5vw,56px)] leading-[1.02] max-w-2xl mx-auto"
          >
            This page didn&apos;t make rounds.
          </motion.h1>

          <motion.p
            variants={beat}
            className="mt-6 text-ink/70 max-w-xl mx-auto text-[15px] md:text-[17px] leading-relaxed"
          >
            The page you were after isn&apos;t at this URL. It may have been
            moved, retired, or never existed. Head back to the homepage and
            we&apos;ll get you where you need to be.
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
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-ink/20 text-ink text-sm font-medium hover:bg-ink hover:text-white hover:border-ink transition-colors"
              data-hover
            >
              Contact support
            </Link>
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
