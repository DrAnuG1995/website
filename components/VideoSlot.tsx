"use client";
import { motion } from "framer-motion";

// Blank placeholder container for the CEO/founder video.
// Drop a <video> or Mux <MuxPlayer /> inside later; the frame stays.

export default function VideoSlot({ label = "Message from our founder" }: { label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "150px" }}
      transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden bg-ink shadow-[0_40px_80px_-30px_rgba(26,26,46,0.45)]"
    >
      {/* gradient + grid bg */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 40%, rgba(50,50,255,0.35), transparent 55%), linear-gradient(135deg, #1a1a2e 0%, #0a0a1e 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(205,227,93,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(205,227,93,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Center glyph */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="flex flex-col items-center gap-4 text-bone">
          <div className="w-20 h-20 rounded-full border-2 border-electric/60 grid place-items-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M8 5v14l11-7z" fill="#cde35d" />
            </svg>
          </div>
          <div className="mono text-[10px] tracking-[0.3em] text-electric">VIDEO SLOT</div>
          <div className="display italic text-2xl max-w-xs text-center opacity-90">{label}</div>
          <div className="mono text-[9px] tracking-[0.25em] text-bone/40 mt-2">DROP &lt;VIDEO&gt; OR MUX PLAYER HERE</div>
        </div>
      </div>

      {/* Top-left LIVE tag */}
      <div className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-stat/15 border border-stat/40 text-stat mono text-[10px] tracking-[0.2em]">
        <span className="w-1.5 h-1.5 rounded-full bg-stat animate-pulse-dot" />
        LIVE · CC
      </div>

      {/* Bottom: play pill + caption mock */}
      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
        <div className="display italic text-lg text-bone/90 max-w-md leading-snug">
          {'"We built StatDoctor because doctors deserve their time back."'}
        </div>
        <button
          className="shrink-0 flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full bg-bone/95 text-ink text-xs font-medium hover:scale-105 transition"
          data-hover
        >
          <span className="w-7 h-7 rounded-full bg-ink text-bone grid place-items-center">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </span>
          Play 90s message
        </button>
      </div>
    </motion.div>
  );
}
