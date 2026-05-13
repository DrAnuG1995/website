"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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
  // Scroll-driven portrait drift. As the user scrolls through the
  // hero, the photo gently rises + scales slightly so the page feels
  // alive without anything ever lurching. Tracked off the section
  // itself so the effect is local to the hero, not the whole page.
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section
      ref={sectionRef}
      className="relative pt-28 md:pt-32 pb-12 md:pb-20 px-6 overflow-hidden"
    >
      {/* Two slow-drifting radial accent washes. Same colours as the
          rest of the site, but moving on a slow loop they read as a
          living backdrop rather than a static gradient. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{ duration: 32, ease: "linear", repeat: Infinity }}
        style={{
          backgroundImage:
            "radial-gradient(40% 40% at 80% 20%, rgba(50,50,255,0.10), transparent 70%), radial-gradient(45% 40% at 12% 85%, rgba(205,227,93,0.20), transparent 70%)",
          backgroundSize: "200% 200%",
        }}
      />
      <div className="relative max-w-[1320px] mx-auto grid md:grid-cols-[0.85fr_1.15fr] gap-10 md:gap-14 items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.12, delayChildren: 0.1 },
            },
          }}
        >
          <motion.div
            variants={heroItem}
            className="text-[10px] tracking-[0.22em] uppercase text-muted mb-4"
          >
            About · Founder
          </motion.div>
          <motion.h1
            variants={heroItem}
            className="display text-[clamp(40px,6.5vw,88px)] leading-[0.98]"
          >
            Built by a{" "}
            <span className="italic text-ocean">doctor</span>,
            <br />
            for doctors.
          </motion.h1>
          <motion.p
            variants={heroItem}
            className="mt-6 text-muted max-w-xl text-[15px] md:text-[17px] leading-relaxed"
          >
            StatDoctor exists because the locum system was broken, and the
            person who built it has worked the shifts, made the phone calls,
            and lost the weekends to agency admin.
          </motion.p>

          <motion.div
            variants={heroItem}
            className="mt-8 flex flex-wrap items-center gap-4 text-[11px] tracking-[0.22em] uppercase text-muted"
          >
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ocean" />
              Dr Anu G
            </span>
            <span className="hidden sm:inline opacity-40">·</span>
            <span>CEO &amp; Founder</span>
            <span className="hidden sm:inline opacity-40">·</span>
            <span>Brisbane, AU</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
          style={{ y: portraitY, scale: portraitScale }}
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
          <motion.div
            aria-hidden
            animate={{ opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
            className="absolute -z-10 -inset-4 rounded-[2rem] bg-electric/30 blur-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}

// Variants reused across hero children so the stagger feels uniform.
const heroItem = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] },
  },
};

/* ---------- STORY (3 chapters) ---------- */
function Story() {
  const chapters: { eyebrow: string; head: string; body: string }[] = [
    {
      eyebrow: "Chapter 01 · The shift",
      head: "I was the doctor on the phone.",
      body:
        "I worked the public ED for years. Long weekends, the kind where you eat dinner standing up at 2am and walk out feeling like you'd done something that mattered. On Saturdays I'd pick up a locum shift somewhere regional. Two hundred kilometres out of town, for the rate and the change of scenery. The work I loved. The way I got there I didn't.\n\nEvery booking went through an agency. Late-night phone calls. Rates that shifted depending on who asked first. Forms emailed at 11pm asking for indemnity certificates I'd already uploaded six times. The hospital and I both wanted the same thing. The agency wanted a cut.",
    },
    {
      eyebrow: "Chapter 02 · The lawsuit",
      head: "Then they sued me for staying.",
      body:
        "Seven months after a one-off locum shift at a regional hospital, the team asked me to stay on. We both wanted it. They wanted continuity of care. I wanted to belong somewhere again.\n\nThe agency that had originally placed me, who had not been part of any of the seven months in between, sent a lawyer's letter demanding a buy-out fee. Twenty-five percent of my first-year salary. Three months of pay. For making the introduction once, half a year earlier.\n\nI ignored the letter. I kept working. So the agency went after the hospital instead. The hospital paid the buy-out fee just to make it stop. That was the moment I saw the problem clearly, and decided to do something about it.",
    },
    {
      eyebrow: "Chapter 03 · The build",
      head: "So I built the marketplace I wished existed.",
      body:
        "StatDoctor started as a spreadsheet and a question: what if a hospital could post a shift at a fair rate, and a doctor could accept it directly, in two taps, with their credentials already verified? No phone calls. No agency cut. No lock-in.\n\nIn January 2025 we launched in Victoria with a handful of rural locum doctors and the hospitals that needed them most. Portland District Health was the first to post. A doctor accepted that same evening.\n\nWord spread. Today a team of three (me, Seif, and Prahlad) partners with 47 hospitals across Australia, from Hobart to Tom Price. We've saved them over $200,000 in fees that used to go to people who never set foot in the building. The marketplace I wished existed when I was the doctor on the phone is the one I now run.",
    },
  ];

  return (
    <section className="relative bg-white py-16 md:py-24 px-6">
      <div className="max-w-[1100px] mx-auto space-y-14 md:space-y-20">
        {chapters.map((c, i) => (
          <motion.div
            key={c.head}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
            className="grid md:grid-cols-[0.8fr_1.2fr] gap-6 md:gap-12 items-start"
          >
            <motion.div
              variants={chapterItem}
              className="md:sticky md:top-32"
            >
              <div className="text-[10px] tracking-[0.22em] uppercase text-muted">
                {c.eyebrow}
              </div>
              <div className="mt-2 text-[11px] tracking-[0.18em] uppercase text-muted/60">
                {String(i + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
              </div>
            </motion.div>
            <div>
              <motion.h2
                variants={chapterItem}
                className="display text-[clamp(28px,4.5vw,56px)] leading-[1.05]"
              >
                {c.head}
              </motion.h2>
              {/* Animated underline accent under the chapter headline.
                  Scales in from the left to give the H2 a small visual
                  punch as you arrive at the chapter. */}
              <motion.div
                aria-hidden
                variants={{
                  hidden: { scaleX: 0 },
                  visible: {
                    scaleX: 1,
                    transition: { duration: 0.9, ease: [0.2, 0.8, 0.2, 1] },
                  },
                }}
                style={{ originX: 0 }}
                className="mt-3 h-px w-24 bg-ocean/40"
              />
              {/* Split body on double newlines so each paragraph gets
                  its own staggered fade-in. Reads more cinematic on
                  scroll than a single block of text. */}
              <div className="mt-5 space-y-4 max-w-prose">
                {c.body.split("\n\n").map((para, pi) => (
                  <motion.p
                    key={pi}
                    variants={chapterItem}
                    className="text-muted text-[15px] md:text-[17px] leading-relaxed"
                  >
                    {para}
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// Shared variants for chapter children. Kept up here so each chapter
// uses the exact same fade-up timing and curve.
const chapterItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] },
  },
};

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
    <section className="relative bg-white py-24 md:py-36 px-6 overflow-hidden border-t border-b border-ink/10">
      {/* Ambient ocean-soft wash so the section reads as its own beat
          without needing the heavy lavender card. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(45% 60% at 15% 30%, rgba(123,123,244,0.18), transparent 70%), radial-gradient(40% 60% at 85% 80%, rgba(205,227,93,0.14), transparent 70%)",
        }}
      />

      <div className="relative max-w-[1200px] mx-auto">
        {/* Oversized italic Cormorant quotation mark as a watermark
            behind the quote. Scales with vw so it dominates on desktop
            but never overflows mobile. */}
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
          className="display italic absolute -top-6 md:-top-16 -left-2 md:-left-6 select-none leading-none text-ocean/[0.14]"
          style={{ fontSize: "clamp(200px, 32vw, 460px)" }}
        >
          &ldquo;
        </motion.span>

        <motion.blockquote
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
          }}
          className="relative grid md:grid-cols-[1.4fr_1fr] gap-10 md:gap-16 items-center"
        >
          <div>
            <motion.div
              variants={pullQuoteBeat}
              className="text-[10px] tracking-[0.22em] uppercase text-muted mb-6 inline-flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-ocean" />
              The why
            </motion.div>

            <motion.p
              variants={pullQuoteBeat}
              className="display text-[clamp(28px,3.8vw,54px)] leading-[1.08] max-w-[22ch] text-ink"
            >
              No agencies. Zero commission. Doctors keep every dollar.
              <span className="block mt-4 italic text-ink/85">
                That isn&apos;t a feature.
              </span>
              <span className="block italic text-ocean">
                It&apos;s the whole point.
              </span>
            </motion.p>

            <motion.footer
              variants={pullQuoteBeat}
              className="mt-10 text-[11px] tracking-[0.22em] uppercase text-muted flex items-center gap-3"
            >
              <span className="h-px w-10 bg-ink/30" />
              Dr Anu  ·  Founder
            </motion.footer>
          </div>

          {/* Hero "100%" pulled out as the right-column display
              number — the figure becomes the visual anchor instead of
              sitting buried in the quote text. */}
          <motion.div
            variants={pullQuoteBeat}
            className="relative md:justify-self-end text-left md:text-right"
          >
            <div
              className="display italic text-ocean leading-none tabular-nums select-none"
              style={{ fontSize: "clamp(64px, 9vw, 120px)" }}
            >
              100<span className="not-italic text-ink/35">%</span>
            </div>
            <div className="mt-3 text-[10px] tracking-[0.22em] uppercase text-muted">
              To the doctor, every time
            </div>
          </motion.div>
        </motion.blockquote>
      </div>
    </section>
  );
}

const pullQuoteBeat = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] },
  },
};

/* ---------- CLOSING CTA ----------
   Personal founder sign-off. Treats the end of the essay like the
   end of a letter — italic signature, real email shown, one CTA.
   Drops the generic three-button cluster from the previous version
   in favour of a more human, less "marketing footer" feel. */
function Closing() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Faint accent wash, anchored low-left so the signature reads
          against a warmer background than pure white. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(45% 65% at 12% 80%, rgba(123,123,244,0.15), transparent 70%)",
        }}
      />

      <div className="relative max-w-[1100px] mx-auto px-6 py-20 md:py-28 grid md:grid-cols-[1fr_auto] gap-10 md:gap-16 items-end">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
          }}
        >
          <motion.div
            variants={pullQuoteBeat}
            className="text-[10px] tracking-[0.22em] uppercase text-muted mb-5 inline-flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-ocean" />
            A note from the founder
          </motion.div>

          <motion.p
            variants={pullQuoteBeat}
            className="display text-[clamp(28px,3.8vw,52px)] leading-[1.05] max-w-[22ch] text-ink"
          >
            If you&apos;ve read this far,{" "}
            <span className="italic text-ocean">let&apos;s talk</span>.
          </motion.p>

          <motion.p
            variants={pullQuoteBeat}
            className="mt-6 text-ink/70 max-w-md text-[15px] md:text-[17px] leading-relaxed"
          >
            Doctor, hospital, partner, investor, or just curious —
            I read every message myself.
          </motion.p>

          <motion.div
            variants={pullQuoteBeat}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            <a
              href="mailto:anu@statdoctor.net?subject=Hi%20Anu"
              className="group inline-flex items-center gap-2 text-[15px] md:text-[16px] font-medium text-ink hover:text-ocean transition-colors"
              data-hover
            >
              <span className="underline underline-offset-[5px] decoration-ocean/40 group-hover:decoration-ocean transition-colors">
                anu@statdoctor.net
              </span>
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
            <span aria-hidden className="hidden sm:inline w-px h-5 bg-ink/15" />
            <a
              href="https://www.linkedin.com/in/dr-anu-g-%F0%9F%A9%BA-3b330a248/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] tracking-[0.18em] uppercase text-ink/60 hover:text-ocean transition-colors inline-flex items-center gap-1.5"
              data-hover
            >
              LinkedIn
              <span aria-hidden>↗</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Italic-script signature treatment. Big, hand-signed feel,
            even with the existing serif — italic Cormorant at hero
            scale next to a hairline rule. */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative md:justify-self-end text-left md:text-right"
        >
          <div
            aria-hidden
            className="display italic text-ink leading-none select-none"
            style={{ fontSize: "clamp(40px, 5.5vw, 80px)" }}
          >
            Anu
          </div>
          <div className="mt-3 text-[10px] tracking-[0.22em] uppercase text-muted">
            Founder &amp; CEO  ·  Brisbane
          </div>
        </motion.div>
      </div>
    </section>
  );
}
