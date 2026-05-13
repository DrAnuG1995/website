"use client";
import { motion } from "framer-motion";

type Row = { dim: string; agency: string; sd: string };

const ROWS: Row[] = [
  { dim: "Rate visibility", agency: "After phone tag", sd: "Posted upfront" },
  { dim: "Time to confirm", agency: "2 to 10 days", sd: "Usually under an hour" },
  { dim: "Commission on your earnings", agency: "15 to 25%", sd: "0%" },
];

export default function AgencyCompare() {
  return (
    <section className="relative bg-white py-16 md:py-20 px-6">
      <div className="relative max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-10 md:mb-12"
        >
          <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">
            Agency vs StatDoctor
          </div>
          <h2 className="display text-[clamp(28px,4.5vw,56px)] leading-[1.0]">
            Same shift.{" "}
            <span className="italic text-ocean">Different math</span>.
          </h2>
        </motion.div>

        {/* DESKTOP table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="hidden sm:block rounded-3xl bg-lavender border border-ocean/10 overflow-hidden"
        >
          <div className="grid grid-cols-3 bg-white/40 text-[10px] tracking-[0.22em] uppercase font-semibold text-ink">
            <div className="px-5 md:px-7 py-4">Dimension</div>
            <div className="px-5 md:px-7 py-4 text-muted">Traditional agency</div>
            <div className="px-5 md:px-7 py-4 text-ocean">StatDoctor</div>
          </div>
          {ROWS.map((row, i) => (
            <motion.div
              key={row.dim}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.06 }}
              className="grid grid-cols-3 border-t border-ocean/10"
            >
              <div className="px-5 md:px-7 py-4 text-[14px] md:text-[15px] text-ink">
                {row.dim}
              </div>
              <div className="px-5 md:px-7 py-4 text-[14px] md:text-[15px] text-muted line-through decoration-stat/60">
                {row.agency}
              </div>
              <div className="px-5 md:px-7 py-4 text-[14px] md:text-[15px] text-ocean font-medium">
                {row.sd}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* MOBILE cards */}
        <div className="sm:hidden flex flex-col gap-3">
          {ROWS.map((row, i) => (
            <motion.div
              key={row.dim}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="rounded-2xl bg-lavender border border-ocean/10 p-4"
            >
              <div className="text-[10px] tracking-[0.22em] uppercase font-semibold text-ink mb-3">
                {row.dim}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[9px] tracking-[0.18em] uppercase text-muted mb-1">
                    Agency
                  </div>
                  <div className="text-[13px] text-muted line-through decoration-stat/60">
                    {row.agency}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] tracking-[0.18em] uppercase text-ocean/80 mb-1">
                    StatDoctor
                  </div>
                  <div className="text-[13px] text-ocean font-medium">
                    {row.sd}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
