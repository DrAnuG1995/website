import Link from "next/link";

/* ============================================================
   Site-wide 404.
   Layout in the spirit of the curenast 404 sketch the user
   pinned: oversized "4" digits flanking a hand-drawn medical
   figure, then an editorial headline + body + back-to-home CTA.
   The figure is inline SVG (skin, mask, goggles, lab coat,
   raised gloved hands) so it scales cleanly and inherits the
   brand palette (ocean for mask/gloves, ink for outlines).
   ============================================================ */

export default function NotFound() {
  return (
    <section className="relative min-h-screen bg-white overflow-hidden flex items-center pt-28 md:pt-32 pb-20 md:pb-28 px-6">
      {/* Soft lavender backdrop, anchored at the bottom so the
          nav still reads against clean white at the top. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[75%]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(239,237,255,0.55) 50%, rgba(229,225,255,0.85) 100%)",
        }}
      />

      <div className="relative max-w-[1100px] mx-auto w-full text-center">
        {/* The 4 — figure — 4 row. Numerals + figure scale together
            via clamp so the layout holds on mobile (where it stacks
            tighter) without breaking on desktop. */}
        <div className="relative flex items-end justify-center gap-2 md:gap-6 mb-10 md:mb-12">
          <span
            aria-hidden
            className="display leading-none text-ink select-none"
            style={{ fontSize: "clamp(120px, 22vw, 280px)" }}
          >
            4
          </span>

          <DoctorFigure />

          <span
            aria-hidden
            className="display leading-none text-ink select-none"
            style={{ fontSize: "clamp(120px, 22vw, 280px)" }}
          >
            4
          </span>
        </div>

        <h1 className="display text-[clamp(28px,4.5vw,56px)] leading-[1.05] max-w-2xl mx-auto text-ink">
          Oops. This page didn&apos;t make rounds.
        </h1>

        <p className="mt-5 text-ink/70 max-w-xl mx-auto text-[15px] md:text-[17px] leading-relaxed">
          The page you were after isn&apos;t at this URL. It may have been
          moved, retired, or never existed. Head back to the homepage and
          we&apos;ll get you where you need to be.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
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
        </div>
      </div>
    </section>
  );
}

/* ----- inline SVG doctor figure ----- */
function DoctorFigure() {
  return (
    <svg
      viewBox="0 0 200 260"
      role="img"
      aria-label="A doctor in a mask and goggles, hands raised."
      className="block shrink-0"
      style={{ height: "clamp(160px, 26vw, 320px)", width: "auto" }}
    >
      {/* Hair / head silhouette behind the face */}
      <path
        d="M 45 78 C 45 35, 155 35, 155 78 L 155 100 C 145 86, 130 80, 100 80 C 70 80, 55 86, 45 100 Z"
        fill="#1a1a2e"
      />
      {/* Face */}
      <ellipse cx="100" cy="100" rx="48" ry="50" fill="#d9b08c" />
      {/* Goggle strap across forehead */}
      <rect x="40" y="78" width="120" height="9" rx="3" fill="#1a1a2e" />
      {/* Goggle lenses — translucent ocean tint with ink frame */}
      <rect
        x="50"
        y="82"
        width="42"
        height="26"
        rx="6"
        fill="rgba(123, 123, 244, 0.35)"
        stroke="#1a1a2e"
        strokeWidth="2.2"
      />
      <rect
        x="108"
        y="82"
        width="42"
        height="26"
        rx="6"
        fill="rgba(123, 123, 244, 0.35)"
        stroke="#1a1a2e"
        strokeWidth="2.2"
      />
      {/* Bridge between goggles */}
      <line x1="92" y1="95" x2="108" y2="95" stroke="#1a1a2e" strokeWidth="2.2" />
      {/* Eyes */}
      <circle cx="71" cy="96" r="2.6" fill="#1a1a2e" />
      <circle cx="129" cy="96" r="2.6" fill="#1a1a2e" />
      {/* Mask */}
      <path
        d="M 55 125 Q 100 115 145 125 L 144 158 Q 100 168 56 158 Z"
        fill="#3232ff"
      />
      {/* Mask pleats */}
      <line x1="58" y1="135" x2="142" y2="135" stroke="#ffffff" strokeWidth="1.5" opacity="0.45" />
      <line x1="58" y1="145" x2="142" y2="145" stroke="#ffffff" strokeWidth="1.5" opacity="0.45" />
      <line x1="58" y1="155" x2="142" y2="155" stroke="#ffffff" strokeWidth="1.5" opacity="0.45" />
      {/* Mask ear loops */}
      <path
        d="M 56 128 Q 38 138 50 158"
        stroke="#1a1a2e"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M 144 128 Q 162 138 150 158"
        stroke="#1a1a2e"
        strokeWidth="2"
        fill="none"
      />
      {/* Lab coat body */}
      <path
        d="M 50 165 Q 50 158 60 156 L 80 156 L 100 178 L 120 156 L 140 156 Q 150 158 150 165 L 150 260 L 50 260 Z"
        fill="#ffffff"
        stroke="#1a1a2e"
        strokeWidth="2.2"
      />
      {/* V-neck dark shirt underneath */}
      <path
        d="M 82 156 L 100 178 L 118 156 L 118 175 Q 100 192 82 175 Z"
        fill="#1a1a2e"
      />
      {/* Lab coat lapel hint — single button */}
      <circle cx="100" cy="218" r="2" fill="#1a1a2e" />
      {/* Right arm (viewer's left) — raised */}
      <path
        d="M 60 165 Q 30 145 25 95"
        stroke="#ffffff"
        strokeWidth="22"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 60 165 Q 30 145 25 95"
        stroke="#1a1a2e"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Right glove */}
      <ellipse
        cx="23"
        cy="78"
        rx="20"
        ry="22"
        fill="#3232ff"
        stroke="#1a1a2e"
        strokeWidth="2.2"
      />
      {/* Right glove fingers */}
      <rect x="9" y="50" width="6" height="14" rx="3" fill="#3232ff" stroke="#1a1a2e" strokeWidth="2" />
      <rect x="18" y="46" width="6" height="16" rx="3" fill="#3232ff" stroke="#1a1a2e" strokeWidth="2" />
      <rect x="27" y="48" width="6" height="14" rx="3" fill="#3232ff" stroke="#1a1a2e" strokeWidth="2" />
      <rect x="36" y="54" width="6" height="10" rx="3" fill="#3232ff" stroke="#1a1a2e" strokeWidth="2" />
      {/* Left arm — raised */}
      <path
        d="M 140 165 Q 170 145 175 95"
        stroke="#ffffff"
        strokeWidth="22"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 140 165 Q 170 145 175 95"
        stroke="#1a1a2e"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Left glove */}
      <ellipse
        cx="177"
        cy="78"
        rx="20"
        ry="22"
        fill="#3232ff"
        stroke="#1a1a2e"
        strokeWidth="2.2"
      />
      {/* Left glove fingers */}
      <rect x="158" y="54" width="6" height="10" rx="3" fill="#3232ff" stroke="#1a1a2e" strokeWidth="2" />
      <rect x="167" y="48" width="6" height="14" rx="3" fill="#3232ff" stroke="#1a1a2e" strokeWidth="2" />
      <rect x="176" y="46" width="6" height="16" rx="3" fill="#3232ff" stroke="#1a1a2e" strokeWidth="2" />
      <rect x="185" y="50" width="6" height="14" rx="3" fill="#3232ff" stroke="#1a1a2e" strokeWidth="2" />
    </svg>
  );
}
