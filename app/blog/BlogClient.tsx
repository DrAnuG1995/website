"use client";
import { motion } from "framer-motion";
import SplitText from "@/components/SplitText";
import { useState } from "react";

const POSTS = [
  { cat: "Guide", title: "The true cost of agency fees — a breakdown for doctors", date: "Apr 2026", read: "6 min", color: "#cde35d" },
  { cat: "Culture", title: "Why we built StatDoctor: a 2am story", date: "Apr 2026", read: "4 min", color: "#3232ff" },
  { cat: "Market", title: "Locum rates across Australia — Q1 2026 benchmarks", date: "Mar 2026", read: "8 min", color: "#7b7bf4" },
  { cat: "Product", title: "New: direct messaging between doctors and rostering managers", date: "Mar 2026", read: "3 min", color: "#FF5A36" },
  { cat: "Guide", title: "AHPRA, indemnity, and insurance — what you actually need", date: "Feb 2026", read: "10 min", color: "#cde35d" },
  { cat: "Market", title: "Regional vs. metro: where locum pay is rising fastest", date: "Feb 2026", read: "7 min", color: "#3232ff" },
];

const CATS = ["All", "Guide", "Culture", "Market", "Product"];

export default function BlogClient() {
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? POSTS : POSTS.filter((p) => p.cat === cat);

  return (
    <>
      <section className="pt-40 pb-16 px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="eyebrow mb-4" data-mascot="Stories from the field — written by doctors.">The Journal</div>
          <h1 className="display text-[clamp(48px,8vw,128px)] leading-[0.92]">
            <SplitText>Notes from</SplitText>
            <br />
            <SplitText start={0.6} className="italic text-ocean">the front desk.</SplitText>
          </h1>
        </div>
      </section>

      <section className="px-6 border-b border-ink/10">
        <div className="max-w-[1280px] mx-auto flex gap-2 flex-wrap py-6">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full mono text-[11px] tracking-widest transition-all duration-300 ${
                cat === c ? "bg-ink text-bone" : "bg-gauze hover:bg-ink hover:text-bone"
              }`}
              data-hover
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, i) => (
            <motion.article
              key={p.title}
              layout
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "150px" }}
              transition={{ duration: 0.6, delay: (i % 6) * 0.08 }}
              whileHover={{ y: -6 }}
              className="group cursor-pointer rounded-3xl overflow-hidden bg-gauze border border-ink/10 hover:border-ink transition-colors"
              data-hover
            >
              <div
                className="aspect-[16/10] relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${p.color}33, ${p.color}11)` }}
              >
                <div className="absolute inset-0 grid place-items-center">
                  <div
                    className="w-32 h-32 rounded-full blur-2xl opacity-60 group-hover:scale-125 transition-transform duration-700"
                    style={{ background: p.color }}
                  />
                </div>
                <span className="absolute top-4 left-4 px-3 py-1 bg-ink text-bone mono text-[10px] tracking-widest rounded-full">
                  {p.cat.toUpperCase()}
                </span>
              </div>
              <div className="p-6">
                <h3 className="display text-2xl leading-tight group-hover:text-ocean transition-colors">{p.title}</h3>
                <div className="mt-4 mono text-[11px] tracking-widest text-muted flex justify-between">
                  <span>{p.date.toUpperCase()}</span>
                  <span>{p.read.toUpperCase()}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
}
