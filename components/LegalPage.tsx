"use client";
import { motion } from "framer-motion";
import SplitText from "./SplitText";

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
    <>
      <section className="pt-40 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="eyebrow mb-4">{eyebrow}</div>
          <h1 className="display text-[clamp(48px,7vw,96px)] leading-[0.95]">
            <SplitText>{title}</SplitText>
          </h1>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="pb-32 px-6"
      >
        <article className="max-w-3xl mx-auto legal-prose">{children}</article>
      </motion.section>

      <style jsx global>{`
        .legal-prose p { font-size: 16px; line-height: 1.75; color: #2a2a4e; margin: 0 0 20px; }
        .legal-prose h2 {
          font-family: "Instrument Serif", Georgia, serif;
          font-size: 28px;
          letter-spacing: -0.01em;
          margin: 40px 0 14px;
          line-height: 1.2;
        }
        .legal-prose a { color: #3232ff; }
      `}</style>
    </>
  );
}
