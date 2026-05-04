"use client";
import { motion } from "framer-motion";

export default function LegalPage({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white text-ink">
      <section className="relative pt-32 md:pt-36 pb-8 md:pb-10 px-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(40% 40% at 80% 20%, rgba(50,50,255,0.08), transparent 70%), radial-gradient(40% 40% at 15% 80%, rgba(205,227,93,0.14), transparent 70%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">
              {eyebrow}
            </div>
            <h1 className="display text-[clamp(36px,5.5vw,72px)] leading-[1.0]">
              {title}
            </h1>
          </motion.div>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="pb-24 px-6"
      >
        <article className="max-w-3xl mx-auto legal-prose">{children}</article>
      </motion.section>

      <style jsx global>{`
        .legal-prose p {
          font-family: "Inter", system-ui, sans-serif;
          font-size: 15px;
          line-height: 1.75;
          color: #1a1a2e;
          margin: 0 0 18px;
        }
        .legal-prose h2 {
          font-family: "Cormorant Garamond", "Instrument Serif", Georgia, serif;
          font-weight: 500;
          font-size: clamp(22px, 2.6vw, 28px);
          letter-spacing: -0.012em;
          line-height: 1.15;
          color: #1a1a2e;
          margin: 36px 0 12px;
        }
        .legal-prose a { color: #3232ff; }
        .legal-prose a:hover { text-decoration: underline; }
        .legal-prose .link-underline { text-decoration: underline; text-underline-offset: 3px; }
      `}</style>
    </div>
  );
}
