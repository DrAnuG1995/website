"use client";
import { motion } from "framer-motion";
import SplitText from "@/components/SplitText";
import MagneticButton from "@/components/MagneticButton";
import Counter from "@/components/Counter";

const FEATURES = [
  { tag: "01", title: "Post a shift in 90 seconds", body: "Fill in specialty, date, rate, and requirements. Live to 300+ doctors instantly.", color: "#cde35d" },
  { tag: "02", title: "Approve with one tap", body: "Review doctor credentials, ratings, and shift history. Confirm the right match.", color: "#7b7bf4" },
  { tag: "03", title: "Credentials handled", body: "AHPRA, insurance, CV — verified and stored. No paperwork, no chasing.", color: "#3232ff" },
  { tag: "04", title: "Pay direct, no margin", body: "Transparent rates. The doctor keeps 100%. You save what you'd pay the agency.", color: "#FF5A36" },
];

export default function HospitalsClient() {
  return (
    <>
      {/* HERO */}
      <section className="min-h-screen grid place-items-center pt-32 pb-20 px-6 relative">
        <div className="max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gauze mono text-[11px] tracking-widest"
            data-mascot="Hi hospital — here's why you'll love this."
          >
            <span className="w-1.5 h-1.5 rounded-full bg-ocean animate-pulse-dot" />
            FOR HOSPITALS & CLINICS
          </motion.div>

          <h1 className="display text-[clamp(48px,8vw,120px)] mt-8 leading-[0.95]">
            <SplitText stagger={0.022}>Fill shifts faster.</SplitText>
            <br />
            <SplitText stagger={0.022} start={0.9} className="italic text-ocean">
              Pay agencies less.
            </SplitText>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 1 }}
            className="text-lg md:text-xl text-ink-soft max-w-2xl mx-auto mt-8 leading-relaxed"
          >
            StatDoctor connects you directly with 300+ verified Australian doctors. Post a shift, review
            applicants, confirm in minutes — without the 20% agency markup.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.6 }}
            className="flex flex-wrap gap-4 justify-center mt-12"
          >
            <MagneticButton href="/contact" variant="primary">
              Book a 15-min demo →
            </MagneticButton>
            <MagneticButton href="#how" variant="ghost">
              How it works
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      {/* METRICS */}
      <section className="py-24 px-6 bg-bone-2 border-y border-ink/10">
        <div className="max-w-[1280px] mx-auto grid md:grid-cols-3 gap-12">
          {[
            { v: 48, suf: "h", label: "Median time to fill a shift" },
            { v: 20, suf: "%", label: "Typical savings vs. agency fees" },
            { v: 300, suf: "+", label: "Verified doctors available" },
          ].map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="text-center"
            >
              <div className="display text-[clamp(60px,7vw,100px)] leading-none">
                <Counter to={m.v} />
                <span className="text-ocean text-[0.45em] align-top">{m.suf}</span>
              </div>
              <div className="mono text-[11px] tracking-widest uppercase text-muted mt-4">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS — animated cards */}
      <section id="how" className="py-32 px-6" data-mascot="Four steps. No contracts, no onboarding calls.">
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
            transition={{ duration: 0.8 }}
          >
            <div className="eyebrow mb-4">How it works</div>
            <h2 className="display text-[clamp(40px,7vw,88px)] leading-[0.98]">
              From post to confirmed — <em className="italic text-ocean">in under 24 hours.</em>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "150px" }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="relative p-10 rounded-3xl bg-gauze border border-ink/10 overflow-hidden group cursor-pointer"
                data-hover
              >
                <div
                  className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-700"
                  style={{ background: `radial-gradient(circle, ${f.color}, transparent 60%)` }}
                />
                <div className="relative">
                  <div className="mono text-[11px] tracking-widest text-muted">STEP {f.tag}</div>
                  <h3 className="display text-3xl mt-4 leading-tight">{f.title}</h3>
                  <p className="mt-4 text-ink-soft leading-relaxed">{f.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="py-24 px-6 bg-ink text-bone">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="eyebrow text-electric mb-4">Agency vs. StatDoctor</div>
            <h2 className="display text-[clamp(40px,6vw,72px)] leading-[0.98]">
              The math works.
            </h2>
          </motion.div>

          <div className="rounded-3xl overflow-hidden border border-bone/15">
            <div className="grid grid-cols-3 bg-ink-soft text-bone mono text-[11px] tracking-widest">
              <div className="p-5">DIMENSION</div>
              <div className="p-5 opacity-70">TRADITIONAL AGENCY</div>
              <div className="p-5 text-electric">STATDOCTOR</div>
            </div>
            {[
              ["Agency fee", "15–25%", "0%"],
              ["Time to fill", "2–10 days", "2–48 hours"],
              ["Credential check", "Manual, ongoing", "Continuous & automated"],
              ["Lock-in contract", "12+ months", "None"],
              ["Doctor quality control", "Agency-mediated", "Direct ratings & reviews"],
              ["Payment", "Via agency", "Direct, 48 hours"],
            ].map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "150px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="grid grid-cols-3 border-t border-bone/10 hover:bg-ink-soft/50 transition-colors"
              >
                <div className="p-5 text-sm">{row[0]}</div>
                <div className="p-5 text-sm opacity-60 line-through decoration-stat/60">{row[1]}</div>
                <div className="p-5 text-sm text-electric font-medium">{row[2]}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="display text-[clamp(40px,7vw,88px)] leading-[0.98]">
            Stop paying the <em className="italic text-ocean">agency tax.</em>
          </h2>
          <p className="mt-6 text-lg text-muted">
            15 minutes with our team. Zero commitment. We&apos;ll show you a shift dashboard with your own
            data by end of week.
          </p>
          <div className="mt-10">
            <MagneticButton href="/contact" variant="electric">
              Book a demo →
            </MagneticButton>
          </div>
        </motion.div>
      </section>
    </>
  );
}
