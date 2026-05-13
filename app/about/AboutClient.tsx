"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

/* ============================================================
   /about — founder story page.
   Editorial, scroll-driven. Mirrors the design system used by
   PartnersClient + HomeClient: Cormorant display, italic-ocean
   accent, lavender card tint, rounded-3xl, eyebrow text-[10px]
   tracking-[0.22em] uppercase text-muted.

   Body copy is intentionally placeholder — the layout ships first;
   Anu writes the story into these slots when the shell is signed off.
   ============================================================ */

export default function AboutClient() {
  return (
    <div className="bg-white text-ink">
      <Hero />
      <Story />
      <TravelAgentParallel />
      <PullQuote />
      <Closing />
    </div>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section className="relative pt-28 md:pt-32 pb-12 md:pb-20 px-6 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(40% 40% at 80% 20%, rgba(50,50,255,0.10), transparent 70%), radial-gradient(45% 40% at 12% 85%, rgba(205,227,93,0.20), transparent 70%)",
        }}
      />
      <div className="relative max-w-[1320px] mx-auto grid md:grid-cols-[0.85fr_1.15fr] gap-10 md:gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-4">
            About · Founder
          </div>
          <h1 className="display text-[clamp(40px,7vw,96px)] leading-[0.95]">
            Built by a{" "}
            <span className="italic text-ocean">doctor</span>,
            <br />
            for doctors.
          </h1>
          <p className="mt-6 text-muted max-w-xl text-[15px] md:text-[17px] leading-relaxed">
            StatDoctor exists because the locum system was broken, and the
            person who built it has worked the shifts, made the phone calls,
            and lost the weekends to agency admin.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-[11px] tracking-[0.22em] uppercase text-muted">
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ocean" />
              Dr Anu G
            </span>
            <span className="hidden sm:inline opacity-40">·</span>
            <span>CEO &amp; Founder</span>
            <span className="hidden sm:inline opacity-40">·</span>
            <span>Brisbane, AU</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative"
        >
          <div className="relative aspect-[5/6] md:aspect-[4/5] lg:min-h-[640px] rounded-3xl overflow-hidden bg-lavender border border-ocean/10">
            <Image
              src="/author-anu-speaking.png"
              alt="Dr Anu, founder of StatDoctor, speaking on stage"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover object-center"
            />
          </div>
          <div
            aria-hidden
            className="absolute -z-10 -inset-4 rounded-[2rem] bg-electric/30 blur-2xl opacity-50"
          />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- STORY (3 chapters) ---------- */
function Story() {
  const chapters: { eyebrow: string; head: string; body: string }[] = [
    {
      eyebrow: "Chapter 01 · The shift",
      head: "I was the doctor on the phone.",
      body:
        "I worked the public ED and picked up locum shifts on the side. Every couple of weeks the same agency call would come in: a regional hospital, last-minute, mid-evening, take it or someone else will. I'd say yes, drive the hours, work the weekend, and watch a quarter of what the hospital paid disappear before it ever reached me. Same work, two prices, and nobody in the middle was the one short on rest.",
    },
    {
      eyebrow: "Chapter 02 · The realisation",
      head: "Locum doesn't have to work this way.",
      body:
        "The agency model only works if doctors don't see the numbers. Hospitals pay the full rate. Doctors get quoted whatever margin keeps the agency healthy. Lock-in contracts make doctors stay. Buy-out clauses tax permanent hires. Credentialing, indemnity uploads, rate negotiation, all of it falls on the doctor every time, even when the hospital and the doctor would happily deal directly. The middleman exists because the system was built when there was no other way to connect the two sides. There is one now.",
    },
    {
      eyebrow: "Chapter 03 · The build",
      head: "So I built the marketplace I wished existed.",
      body:
        "StatDoctor started as a spreadsheet and a question: what if a hospital could post a shift at a fair rate and a doctor could accept it directly, in two taps, with their credentials already verified? In January 2025 we launched in Victoria with a handful of rural locum doctors and the hospitals that needed them most. Portland District Health was the first to post. A doctor accepted that same evening. Word spread. Today a team of three (me, Seif, and Prahlad) partners with 47 hospitals across Australia, from Hobart to Tom Price, and we've saved them over $200,000 in recruitment fees. The marketplace I wished existed when I was the doctor on the phone is the one I now run.",
    },
  ];

  return (
    <section className="relative bg-white py-16 md:py-24 px-6">
      <div className="max-w-[1100px] mx-auto space-y-14 md:space-y-20">
        {chapters.map((c, i) => (
          <motion.div
            key={c.head}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className="grid md:grid-cols-[0.8fr_1.2fr] gap-6 md:gap-12 items-start"
          >
            <div className="md:sticky md:top-32">
              <div className="text-[10px] tracking-[0.22em] uppercase text-muted">
                {c.eyebrow}
              </div>
              <div className="mt-2 text-[11px] tracking-[0.18em] uppercase text-muted/60">
                {String(i + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
              </div>
            </div>
            <div>
              <h2 className="display text-[clamp(28px,4vw,52px)] leading-[1.05]">
                {c.head}
              </h2>
              <p className="mt-5 text-muted text-[15px] md:text-[17px] leading-relaxed max-w-prose">
                {c.body}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------- TRAVEL-AGENT PARALLEL ----------
   A short thesis interlude between the personal Story and the
   founder PullQuote. Re-uses the chapter grid (eyebrow column left,
   body column right) so it feels of-a-piece with the chapters, but
   the eyebrow signals "argument, not narrative". */
function TravelAgentParallel() {
  return (
    <section className="relative bg-white py-12 md:py-16 px-6">
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="grid md:grid-cols-[0.8fr_1.2fr] gap-6 md:gap-12 items-start"
        >
          <div className="md:sticky md:top-32">
            <div className="text-[10px] tracking-[0.22em] uppercase text-muted">
              The parallel
            </div>
            <div className="mt-2 text-[11px] tracking-[0.18em] uppercase text-muted/60">
              Why now
            </div>
          </div>
          <div>
            <h2 className="display text-[clamp(28px,4vw,52px)] leading-[1.05]">
              Nobody books a flight through a{" "}
              <span className="italic text-ocean">travel agent</span> anymore.
            </h2>
            <p className="mt-5 text-muted text-[15px] md:text-[17px] leading-relaxed max-w-prose">
              You open the airline app, pick the seat, pay the fare. The
              middleman existed because flight schedules and fares used to
              live in a back office. Once the information moved onto a phone,
              the agent&apos;s only remaining job was collecting a margin for
              connecting two parties who could now find each other in one tap.
            </p>
            <p className="mt-4 text-muted text-[15px] md:text-[17px] leading-relaxed max-w-prose">
              Locum work was the last holdout. There&apos;s no good reason for
              an agency to sit between a doctor and a hospital that both want
              the same thing on the same Wednesday night. The shift is on a
              phone. So is the contract. So is the credential. The middleman
              is just the friction.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- PULL QUOTE ---------- */
function PullQuote() {
  return (
    <section className="relative bg-white py-12 md:py-16 px-6">
      <div className="max-w-[1100px] mx-auto">
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="rounded-3xl bg-lavender border border-ocean/10 px-8 md:px-14 py-12 md:py-16"
        >
          <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-5">
            The why
          </div>
          <p className="display text-[clamp(26px,3.5vw,46px)] leading-[1.15]">
            “No agencies. Zero commission. Doctors keep{" "}
            <span className="italic text-ocean">100%</span>. That isn&apos;t a
            feature, it&apos;s the whole point.”
          </p>
          <footer className="mt-6 text-[11px] tracking-[0.22em] uppercase text-muted">
            Dr Anu, Founder
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
}

/* ---------- CLOSING CTA ---------- */
function Closing() {
  return (
    <section className="relative bg-white">
      <div className="relative max-w-[1100px] mx-auto px-6 py-16 md:py-20 text-center">
        <h2 className="display text-[clamp(28px,4.5vw,56px)] leading-[1.0] max-w-3xl mx-auto">
          Want to{" "}
          <span className="italic text-ocean">talk</span>?
        </h2>
        <p className="mt-4 text-muted max-w-xl mx-auto text-[14px] md:text-[15px] leading-relaxed">
          Doctor, hospital, partner, investor, or just curious. I read every
          message.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/for-doctors"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-electric text-ink text-sm font-semibold hover:bg-ocean hover:text-white transition-colors"
            data-hover
          >
            Join as a doctor →
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-ink/20 text-ink text-sm font-medium hover:bg-ink hover:text-white transition-colors"
            data-hover
          >
            Talk to me
          </Link>
          <a
            href="https://www.linkedin.com/in/dr-anu-g-%F0%9F%A9%BA-3b330a248/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-ink/70 text-sm font-medium hover:text-ocean transition-colors"
            data-hover
          >
            LinkedIn ↗
          </a>
        </div>
      </div>
    </section>
  );
}
