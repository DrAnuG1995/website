"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import HeroMap from "@/components/home/HeroMap";
import LiveStatsStrip from "@/components/home/LiveStats";
import AppShowcase from "@/components/home/AppShowcase";
import NotAnAgency from "@/components/home/NotAnAgency";
import HowWereDifferent from "@/components/home/HowWereDifferent";
import LiveShiftFeed from "@/components/home/LiveShiftFeed";
import type { LiveShift, LiveStats, MapHospital } from "@/lib/hospitals";
import { PARTNER_LOGOS } from "@/lib/partner-logos";

/* =========================================================
   HOMEPAGE, doctor-download funnel
   01 Hero map · 02 Logos · 03 Founder video · 04 App showcase ·
   05 Doctor voices · 06 FAQ · 07 Final CTA
   ========================================================= */

export default function HomeClient({
  hospitals,
  shiftCounts,
  liveShifts,
  liveStats,
}: {
  hospitals: MapHospital[];
  shiftCounts: Record<string, number>;
  liveShifts: LiveShift[];
  liveStats: LiveStats;
}) {
  const partnerCount = hospitals.length;
  return (
    <div className="bg-white text-ink">
      <HeroMap hospitals={hospitals} shiftCounts={shiftCounts} />
      <LiveStatsStrip initial={liveStats} />
      <LogosStrip partnerCount={partnerCount} />
      <FounderVideo />
      <AppShowcase />
      <NotAnAgency />
      <HowWereDifferent />
      <LiveShiftFeed initialShifts={liveShifts} />
      <DoctorVoicesPinned />
      <FAQGrid />
      <FinalCTA />
    </div>
  );
}

/* ============================================================
   02, LOGOS STRIP
   ============================================================ */
function LogosStrip({ partnerCount }: { partnerCount: number }) {
  // Single row, doubled for a seamless -50% loop. Each logo sits inside a
  // fixed-width slot so visible spacing reads identical regardless of the
  // logo's natural width.
  const doubled = [...PARTNER_LOGOS, ...PARTNER_LOGOS];
  return (
    <section className="py-12 md:py-14 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center gap-4"
        >
          <div>
            <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-2">The network</div>
            <h2 className="display text-[clamp(24px,3.2vw,40px)] leading-[1.05] max-w-2xl mx-auto">
              Trusted by hospitals from <span className="italic text-ocean">Cairns to Hobart</span>.
            </h2>
          </div>
          <Link
            href="/partners"
            className="group inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-muted hover:text-ocean transition-colors"
            data-hover
          >
            {partnerCount > 0 ? `${partnerCount} hospitals · growing weekly` : "Growing weekly"}
            <span
              aria-hidden
              className="inline-block transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </motion.div>
      </div>

      <div className="marquee-mask">
        {/* Fixed-width slots so every center-to-center distance is identical
            — including the wrap point. Visible whitespace can still look
            uneven where source PNGs have heavy transparent padding baked
            in, but the rhythm of the loop is mathematically uniform. */}
        <div className="flex w-max items-center animate-marquee-slow hover:[animation-play-state:paused]">
          {doubled.map((logo, i) => (
            <div
              key={i}
              className="shrink-0 w-[150px] md:w-[170px] flex items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt=""
                style={{ height: `${logo.h ?? 51}px` }}
                className="w-auto max-w-[120px] md:max-w-[140px] opacity-60 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}


/* ============================================================
   04, FOUNDER VIDEO (autoplay-on-scroll)
   ============================================================ */
function FounderVideo() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!ref.current || !videoRef.current) return;
    const v = videoRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.4) {
            v.play().then(() => setPlaying(true)).catch(() => {});
          } else {
            v.pause();
            setPlaying(false);
          }
        });
      },
      { threshold: [0, 0.4, 0.6] },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative bg-white pt-10 pb-14 md:pt-12 md:pb-20 px-4 md:px-6">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-2">
            From the founder
          </div>
          <h2 className="display text-[clamp(24px,3.6vw,44px)] leading-[1.0]">
            A note to my fellow <span className="italic text-ocean">locum doctors</span>.
          </h2>
        </motion.div>

        <div ref={ref} className="relative max-w-[900px] mx-auto">
          {/* electric/ocean glow underneath the frame */}
          <div
            aria-hidden
            className="absolute -inset-4 md:-inset-6 rounded-[34px] -z-10"
            style={{
              background:
                "linear-gradient(135deg, rgba(50,50,255,0.35), rgba(205,227,93,0.45))",
              filter: "blur(28px)",
              opacity: 0.5,
            }}
          />
          <div className="relative rounded-[24px] md:rounded-[28px] overflow-hidden border-2 border-ocean/40 shadow-[0_40px_120px_-30px_rgba(50,50,255,0.45)] bg-ink">
            <video
              ref={videoRef}
              className="block w-full h-auto"
              src="/founder-video.mp4"
              poster="/founder-video-poster.jpg"
              muted={muted}
              loop
              playsInline
              preload="metadata"
            />

            {/* mute / sound toggle */}
            <button
              onClick={() => {
                if (!videoRef.current) return;
                const next = !muted;
                videoRef.current.muted = next;
                setMuted(next);
                if (!playing) videoRef.current.play().catch(() => {});
              }}
              className="absolute bottom-4 right-4 md:bottom-5 md:right-5 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-ink/10 text-xs font-medium text-ink hover:bg-white transition-colors flex items-center gap-2"
              data-hover
            >
              <span className="block w-1.5 h-1.5 rounded-full bg-electric" />
              {muted ? "Tap for sound" : "Sound on"}
            </button>

            {/* Founder credit */}
            <a
              href="https://www.linkedin.com/in/dr-anu-g-%F0%9F%A9%BA-3b330a248/"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-4 md:bottom-5 md:left-5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-ink/10 text-[11px] font-medium hover:bg-white hover:text-ocean transition-colors"
              data-hover
            >
              Dr Anu, CEO &amp; Founder StatDoctor
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   05, VOICES · Lyra-style 3-column auto-scrolling wall
   Column 1 ↑, Column 2 ↓, Column 3 ↑.  Real testimonies pulled
   from statdoctor.app. Hover any card to pause the column.
   ============================================================ */
const DOCTORS: {
  name: string;
  credential: string;
  img: string;
  quote: string;
  accent: "ocean" | "electric" | "leaf" | "ink";
  // Per-image crop tuning so the face actually centers in the 40x40 avatar.
  // imgPos = CSS object-position; imgScale = the magnification applied
  // before cropping. Defaults assume a centered headshot.
  imgPos?: string;
  imgScale?: number;
}[] = [
  {
    name: "Dr Layth Samari",
    credential: "MD · ACEM Trainee",
    img: "/doctors/dr-layth.png",
    quote:
      "A great initiative to help doctors be in charge of their own work-life balance with the ease of picking up shifts on demand.",
    accent: "ocean",
    imgPos: "50% 32%",
    imgScale: 1.0,
  },
  {
    name: "Dr Brian Rose",
    credential: "MD · HMO",
    img: "https://cdn.prod.website-files.com/688db6d677516719c3925d01/69a105632dceffa4f8933daf_Screenshot%202026-02-27%20at%2012.45.10%E2%80%AFpm.png",
    quote:
      "StatDoctor enables me to see all the available shifts on my own device, on my own terms. No annoying phone calls from managing reps trying to push me to do shifts I don't want. It's the stress-free approach to locuming.",
    accent: "electric",
    imgPos: "50% 30%",
    imgScale: 1.0,
  },
  {
    name: "Dr Sophia Dean",
    credential: "MBChB · HMO",
    img: "https://cdn.prod.website-files.com/688db6d677516719c3925d01/69a025521b7592495cd25042_Screenshot%202026-02-26%20at%208.49.40%E2%80%AFpm.png",
    quote:
      "As a first-time locum from New Zealand, I've been thoroughly impressed with the efficiency and user-friendliness of this app. The ability to view available shifts, including exact dates and times, has made planning my work so much easier.",
    accent: "leaf",
    imgPos: "50% 30%",
    imgScale: 1.0,
  },
  {
    name: "Dr David Burton",
    credential: "MBChB · FRNZCGP",
    img: "/doctors/dr-david.png",
    quote:
      "StatDoctor is a brilliant solution to the ridiculous financial burden on public hospitals that locum agencies were charging, and the drudgery and admin of locuming. It's better, sleeker, easier to navigate and more invested in making locuming work well for both parties than any locum agency.",
    accent: "ocean",
    imgPos: "50% 30%",
    imgScale: 1.0,
  },
  {
    name: "Dr Alex Patinkin",
    credential: "MD · ACEM Trainee",
    img: "https://cdn.prod.website-files.com/688db6d677516719c3925d01/697b6465bfe917b72c1a6d2a_1723897169563.jpeg",
    quote:
      "I'm a full-time emergency registrar and locum frequently on the side through multiple big agencies. It's often difficult to find shifts because their job boards don't let me filter out work that doesn't fit my schedule. I love how much easier StatDoctor is to use.",
    accent: "electric",
    imgPos: "50% 30%",
    imgScale: 1.0,
  },
  {
    name: "Dr Marillo Jayasuriya",
    credential: "MD · FACEM",
    img: "https://cdn.prod.website-files.com/688db6d677516719c3925d01/697b6440a3f19ada5550b8b8_1702447089847.jpeg",
    quote:
      "Such an easy-to-use platform that gives locum doctors more control of their shifts.",
    accent: "ink",
    imgPos: "50% 30%",
    imgScale: 1.0,
  },
  {
    name: "Dr Greeshma Gopakumar",
    credential: "MD · HMO",
    img: "https://cdn.prod.website-files.com/688db6d677516719c3925d01/6978195af46d2753c3e3422d_Adobe%20Express%20-%20file%20(26).png",
    quote:
      "On signing up, the whole process was extremely easy and straightforward. It's transparent with no hidden T&Cs unlike many agencies. Truly a game changer for locum doctors.",
    accent: "leaf",
    imgPos: "50% 32%",
    imgScale: 1.0,
  },
];

function DoctorVoicesPinned() {
  const cols: (typeof DOCTORS)[] = [[], [], []];
  DOCTORS.forEach((d, i) => cols[i % 3].push(d));
  // Pause the marquee animations when the section is offscreen so they
  // don't burn CPU/battery on long scrolls.
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!sectionRef.current) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-white py-20 md:py-24 px-6 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 0%, rgba(50,50,255,0.06), transparent 70%), radial-gradient(50% 40% at 50% 100%, rgba(205,227,93,0.10), transparent 70%)",
        }}
      />

      {/* heading */}
      <div className="relative max-w-[1280px] mx-auto mb-10 md:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">
            Doctors using StatDoctor
          </div>
          <h2 className="display text-[clamp(28px,4.5vw,56px)] leading-[1.0] max-w-3xl mx-auto">
            <span className="italic text-ocean">Earning more.</span> Calling fewer agencies.
          </h2>
        </motion.div>
      </div>

      {/* Mobile: single vertical-rolling column — auto-scrolls every
          testimonial through the viewport showing ~1-2 cards at a time. */}
      <div className="md:hidden relative max-w-[1280px] mx-auto h-[440px] overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, white, transparent)" }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to top, white, transparent)" }}
        />
        <TestimonialColumn
          cards={DOCTORS}
          direction="up"
          duration={48}
          paused={!inView}
        />
      </div>

      {/* Desktop: three auto-scrolling columns with fade masks. */}
      <div className="hidden md:block relative max-w-[1280px] mx-auto h-[600px] overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, white, transparent)" }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to top, white, transparent)" }}
        />

        <div className="grid grid-cols-3 gap-6 h-full">
          {cols.map((col, ci) => (
            <TestimonialColumn
              key={ci}
              cards={col}
              direction={ci % 2 === 0 ? "up" : "down"}
              duration={42 + ci * 6}
              paused={!inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialColumn({
  cards,
  direction,
  duration,
  paused,
}: {
  cards: typeof DOCTORS;
  direction: "up" | "down";
  duration: number;
  paused?: boolean;
}) {
  // Duplicate cards so the marquee loop is seamless. Desktop-only — mobile
  // uses the swipe carousel above.
  const doubled = [...cards, ...cards];
  return (
    <div className="relative h-full overflow-hidden">
      <div
        className="flex flex-col gap-6 hover:[animation-play-state:paused]"
        style={{
          animation: `${direction === "up" ? "scrollColUp" : "scrollColDown"} ${duration}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {doubled.map((d, i) => (
          <TestimonialCard key={i} d={d} />
        ))}
      </div>

      <style jsx>{`
        @keyframes scrollColUp {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        @keyframes scrollColDown {
          from { transform: translateY(-50%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function TestimonialCard({ d }: { d: (typeof DOCTORS)[number] }) {
  const accent =
    d.accent === "ocean"
      ? "bg-ocean"
      : d.accent === "electric"
      ? "bg-electric"
      : d.accent === "leaf"
      ? "bg-leaf"
      : "bg-ink";
  return (
    <article
      className="relative bg-white border border-ink/10 rounded-2xl p-5 md:p-6 shadow-[0_15px_45px_-25px_rgba(26,26,46,0.18)] hover:shadow-[0_25px_60px_-25px_rgba(26,26,46,0.3)] hover:-translate-y-1 transition-all duration-300"
      data-hover
    >
      <span aria-hidden className={`absolute left-5 right-5 top-0 h-[2px] ${accent} rounded-full`} />
      <p className="display text-[15px] md:text-base leading-[1.4] text-ink">
        &ldquo;{d.quote}&rdquo;
      </p>
      <div className="mt-5 pt-4 border-t border-ink/8 flex items-center gap-3">
        <div className="relative shrink-0">
          <div className={`absolute -inset-0.5 rounded-full ${accent} opacity-50 blur-[2px]`} />
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={d.img}
              alt={d.name}
              className="w-full h-full object-cover"
              style={{
                objectPosition: d.imgPos ?? "50% 30%",
                transform: `scale(${d.imgScale ?? 1.2})`,
              }}
            />
          </div>
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-[13px] truncate">{d.name}</div>
          <div className="text-[11px] text-muted mt-0.5 truncate">{d.credential}</div>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   06, FAQ · objection-shaped expandable boxes
   ============================================================ */
const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "When do I actually get paid?",
    a: "Most shifts pay out within 48 hours of completion, straight to your bank account. No invoicing, no agency middleman, no chasing finance on a Friday afternoon.",
  },
  {
    q: "Do you take a commission from my rate?",
    a: "No. The rate you see in the app is the rate you get paid. Hospitals pay a small platform fee on each accepted shift, over 75% cheaper than any locum agency, but it never comes out of your earnings.",
  },
  {
    q: "How are doctors verified?",
    a: "We run the same checks as any reputable locum agency: identity, AHPRA registration, indemnity, and references. You upload everything once. After that every shift application is a single tap.",
  },
  {
    q: "What credentials do I need to upload?",
    a: "AHPRA registration, current indemnity certificate, and an up-to-date CV. Hospitals may request specific items (e.g. recent CPR certificate) for certain shifts, those appear before you apply.",
  },
  {
    q: "How fast do hospitals confirm a shift?",
    a: "Most shifts confirm within the hour. Urgent same-day shifts are typically confirmed in under 30 minutes, far faster than agencies, because the hospital posts and confirms directly inside the app.",
  },
  {
    q: "What about travel and accommodation?",
    a: "Most rural and regional hospitals reimburse travel and cover accommodation. Each listing shows exactly what's included before you apply, no chasing the hospital after the fact.",
  },
  {
    q: "What happens if a shift is cancelled?",
    a: "If a hospital cancels within 24 hours of the shift, our cancellation policy guarantees a partial payout. Full terms are visible inside the app before you accept any shift.",
  },
  {
    q: "Which states are you live in?",
    a: "Active partner hospitals across VIC, NSW, QLD, SA, WA and TAS. New hospitals are joining the network weekly.",
  },
];

function FAQGrid() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="relative bg-white py-20 md:py-24 px-6">
      <div className="relative max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-12"
        >
          <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">FAQ</div>
          <h2 className="display text-[clamp(28px,4.5vw,56px)] leading-[1.0]">
            The questions doctors <span className="italic text-ocean">ask first</span>.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 items-start">
          {FAQ_ITEMS.map((item, i) => (
            <FAQBox
              key={item.q}
              item={item}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQBox({
  item,
  open,
  onToggle,
}: {
  item: { q: string; a: string };
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`rounded-2xl border transition-colors ${
        open ? "bg-bone border-ink/15" : "bg-white border-ink/10 hover:border-ink/20"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 md:px-6 md:py-5 text-left"
        aria-expanded={open}
        data-hover
      >
        <span className="display text-[16px] md:text-[18px] leading-[1.25]">
          {item.q}
        </span>
        <span
          className={`shrink-0 w-7 h-7 grid place-items-center rounded-full border border-ink/15 transition-transform ${
            open ? "rotate-45 bg-ink text-white border-ink" : "text-ink"
          }`}
          aria-hidden
        >
          +
        </span>
      </button>
      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="px-5 md:px-6 pb-5 md:pb-6 text-sm md:text-[15px] text-muted leading-relaxed">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   07, FINAL CTA · download band + socials
   ============================================================ */
const SOCIALS: { label: string; href: string; Icon: () => JSX.Element }[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/statdoctor/",
    Icon: LIIcon,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/p/StatDoctor-100088461867629/",
    Icon: FBIcon,
  },
  { label: "Email", href: "mailto:info@statdoctor.app", Icon: MailIcon },
];

function FinalCTA() {
  return (
    <section className="relative bg-white">
      <div className="relative max-w-[1100px] mx-auto px-6 py-14 md:py-16 text-center">
        <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">
          Free · iOS &amp; Android
        </div>
        <h2 className="display text-[clamp(28px,4.5vw,56px)] leading-[1.0] max-w-3xl mx-auto">
          Locum shifts in your pocket.{" "}
          <span className="italic text-ocean">Two taps to apply.</span>
        </h2>
        <p className="mt-4 text-muted max-w-xl mx-auto text-[14px] md:text-[15px] leading-relaxed">
          Posted rate visible upfront. Paid in 48 hours.
        </p>

        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[440px] mx-auto">
          <a
            href="https://apps.apple.com/au/app/statdoctor/id6452677138"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-5 py-3 rounded-2xl bg-ink text-white hover:bg-ocean transition-colors"
            data-hover
          >
            <span className="inline-flex items-center gap-3 w-[140px]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="shrink-0">
                <path d="M16.365 1.43c0 1.14-.43 2.23-1.13 3.04-.85.99-2.23 1.76-3.36 1.66-.14-1.1.41-2.27 1.13-3.05.81-.92 2.27-1.65 3.36-1.65zM20.5 17.4c-.55 1.27-.81 1.83-1.51 2.95-.98 1.55-2.36 3.48-4.07 3.5-1.52.02-1.91-.99-3.97-.97-2.07.01-2.49 1-4.02.98-1.71-.02-3.02-1.77-4-3.32-2.74-4.32-3.03-9.4-1.34-12.1 1.2-1.93 3.1-3.06 4.88-3.06 1.82 0 2.96.99 4.46.99 1.46 0 2.35-.99 4.45-.99 1.59 0 3.27.86 4.47 2.36-3.93 2.16-3.29 7.82.65 9.66z" />
              </svg>
              <span className="text-left">
                <span className="block text-[10px] tracking-[0.18em] uppercase opacity-70">
                  Get it on
                </span>
                <span className="block text-sm font-semibold leading-tight">App Store</span>
              </span>
            </span>
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=user.statdoctor.app&hl=en_AU"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-5 py-3 rounded-2xl bg-ocean text-white hover:bg-ink transition-colors"
            data-hover
          >
            <span className="inline-flex items-center gap-3 w-[140px]">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="shrink-0">
                <path
                  fill="currentColor"
                  d="M3.6 1.5c-.3.3-.5.7-.5 1.3v18.4c0 .6.2 1 .5 1.3l10.7-10.5L3.6 1.5zm12 8.4L5.6 1.4l11.7 6.7-1.7 1.8zm3 1.6l-2.4-1.4-1.9 1.9 1.9 1.9 2.4-1.4c.7-.4.7-1.6 0-2zm-12.7 11l10.1-9.7-1.7-1.8L5.9 22.5z"
                />
              </svg>
              <span className="text-left">
                <span className="block text-[10px] tracking-[0.18em] uppercase opacity-80">
                  Get it on
                </span>
                <span className="block text-sm font-semibold leading-tight">
                  Google Play
                </span>
              </span>
            </span>
          </a>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-10 h-10 grid place-items-center rounded-full border border-ink/12 text-ink/70 hover:bg-ink hover:text-white hover:border-ink transition-colors"
              data-hover
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function LIIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function FBIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-7H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v7A10 10 0 0 0 22 12z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

