"use client";
import { motion } from "framer-motion";
import SplitText from "@/components/SplitText";
import MagneticButton from "@/components/MagneticButton";

const PARTNERS = [
  { name: "Royal Melbourne Hospital", state: "VIC", type: "Tertiary" },
  { name: "St Vincent's Hospital Sydney", state: "NSW", type: "Tertiary" },
  { name: "Bendigo Health", state: "VIC", type: "Regional" },
  { name: "Queensland Children's Hospital", state: "QLD", type: "Paediatric" },
  { name: "Cairns Base Hospital", state: "QLD", type: "Regional" },
  { name: "Mater Brisbane", state: "QLD", type: "Private" },
  { name: "Royal Perth Hospital", state: "WA", type: "Tertiary" },
  { name: "Alfred Hospital", state: "VIC", type: "Tertiary" },
  { name: "Geelong Hospital", state: "VIC", type: "Regional" },
  { name: "Box Hill Hospital", state: "VIC", type: "Metro" },
  { name: "Myfast Medical", state: "NSW", type: "GP Clinic" },
  { name: "BRHS Gippsland", state: "VIC", type: "Regional" },
];

export default function PartnersClient() {
  return (
    <>
      <section className="pt-40 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto" data-mascot="Our partners — and growing.">
          <div className="eyebrow mb-4">The Network</div>
          <h1 className="display text-[clamp(48px,8vw,120px)] leading-[0.95]">
            <SplitText stagger={0.022}>60+ partners.</SplitText>
            <br />
            <SplitText start={0.8} className="italic text-ocean">Every state.</SplitText>
          </h1>
          <p className="mt-8 text-lg text-muted max-w-xl mx-auto">
            Tertiary, regional, private, GP. From Royal Melbourne to Cairns Base — doctors on StatDoctor
            work everywhere.
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PARTNERS.map((p, i) => (
            <motion.article
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "150px" }}
              transition={{ duration: 0.6, delay: (i % 6) * 0.08 }}
              whileHover={{ y: -4 }}
              className="p-6 bg-gauze border border-ink/10 rounded-2xl hover:border-ink transition-colors cursor-pointer"
              data-hover
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="mono text-[10px] tracking-widest text-ocean">{p.state}</div>
                  <h3 className="display text-xl mt-2 leading-tight">{p.name}</h3>
                </div>
                <span className="mono text-[10px] tracking-widest px-2 py-1 bg-ink text-electric rounded-full shrink-0">
                  {p.type.toUpperCase()}
                </span>
              </div>
              <div className="mt-5 pt-4 border-t border-ink/10 flex items-center gap-2 mono text-[10px] tracking-widest text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-electric animate-pulse-dot" />
                ACTIVE PARTNER
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="display text-[clamp(36px,5vw,64px)] leading-tight">
            Add your hospital to the <em className="italic text-ocean">list.</em>
          </h2>
          <div className="mt-8">
            <MagneticButton href="/contact" variant="primary">Become a partner →</MagneticButton>
          </div>
        </motion.div>
      </section>
    </>
  );
}
