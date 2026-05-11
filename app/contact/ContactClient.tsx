"use client";
import { motion } from "framer-motion";
import { useState } from "react";

/* ============================================================
   /contact, get in touch.
   Mirrors the home design system: Cormorant display, italic-ocean
   accent, lavender form card, eyebrow text-[10px] tracking-[0.22em].
   All routes funnel into info@statdoctor.app.
   ============================================================ */

type Role = "doctor" | "hospital" | "press" | "other";

export default function ContactClient() {
  const [sent, setSent] = useState(false);
  const [role, setRole] = useState<Role>("doctor");

  return (
    <div className="bg-white text-ink">
      <Hero />
      <Body sent={sent} setSent={setSent} role={role} setRole={setRole} />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 md:pt-36 pb-8 md:pb-12 px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(40% 40% at 80% 20%, rgba(50,50,255,0.10), transparent 70%), radial-gradient(40% 40% at 15% 80%, rgba(205,227,93,0.18), transparent 70%)",
        }}
      />
      <div className="relative max-w-[1100px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">
            Get in touch
          </div>
          <h1 className="display text-[clamp(36px,6vw,84px)] leading-[0.98]">
            Let&apos;s talk.{" "}
            <span className="italic text-ocean">No scripts</span>.
          </h1>
          <p className="mt-5 text-muted max-w-xl mx-auto text-[15px] md:text-base leading-relaxed">
            One inbox covers everything. We aim to reply within one business
            day.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Body({
  sent,
  setSent,
  role,
  setRole,
}: {
  sent: boolean;
  setSent: (v: boolean) => void;
  role: Role;
  setRole: (r: Role) => void;
}) {
  return (
    <section className="relative pb-20 md:pb-24 px-6">
      <div className="max-w-[1100px] mx-auto grid md:grid-cols-[1fr_1.4fr] gap-10 md:gap-14 items-start">
        <ContactInfo />
        <Form sent={sent} setSent={setSent} role={role} setRole={setRole} />
      </div>
    </section>
  );
}

function ContactInfo() {
  return (
    <div className="md:sticky md:top-28 md:self-start space-y-7">
      <div>
        <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-2">
          Email
        </div>
        <a
          href="mailto:info@statdoctor.app"
          className="display text-[clamp(22px,2.6vw,30px)] leading-tight text-ink hover:text-ocean transition-colors"
          data-hover
        >
          info@statdoctor.app
        </a>
        <p className="mt-2 text-[13px] text-muted leading-relaxed">
          Doctors, hospitals, press, partnerships, all welcome. We route
          internally.
        </p>
      </div>

      <div className="pt-6 border-t border-ink/10">
        <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-2">
          Office
        </div>
        <div className="text-[14px] leading-relaxed text-ink">
          Level 2, Collins St
          <br />
          Melbourne VIC 3000
          <br />
          Australia
        </div>
      </div>

      <div className="pt-6 border-t border-ink/10">
        <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-2">
          Response time
        </div>
        <div className="text-[14px] leading-relaxed text-ink">
          One business day, usually within a few hours.
        </div>
      </div>
    </div>
  );
}

const ROLES: { id: Role; label: string }[] = [
  { id: "doctor", label: "Doctor" },
  { id: "hospital", label: "Hospital" },
  { id: "press", label: "Press" },
  { id: "other", label: "Other" },
];

function Form({
  sent,
  setSent,
  role,
  setRole,
}: {
  sent: boolean;
  setSent: (v: boolean) => void;
  role: Role;
  setRole: (r: Role) => void;
}) {
  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="rounded-3xl bg-lavender border border-ocean/10 p-7 md:p-9"
    >
      {sent ? (
        <div className="py-12 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 14 }}
            className="w-16 h-16 mx-auto rounded-full bg-electric grid place-items-center mb-5"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M20 6L9 17l-5-5"
                stroke="#1a1a2e"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
          <h3 className="display text-[clamp(22px,2.6vw,30px)] leading-tight">
            Message sent.
          </h3>
          <p className="mt-2 text-[14px] text-muted">
            We&apos;ll reply within one business day.
          </p>
        </div>
      ) : (
        <>
          <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">
            I am a
          </div>
          <div className="flex gap-2 mb-7 flex-wrap">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`px-4 py-2 rounded-full text-[11px] tracking-[0.18em] uppercase font-semibold transition-all duration-300 ${
                  role === r.id
                    ? "bg-ink text-white"
                    : "bg-white text-ink border border-ink/12 hover:border-ink hover:bg-ink hover:text-white"
                }`}
                data-hover
              >
                {r.label}
              </button>
            ))}
          </div>

          <Field label="Name" name="name" />
          <Field label="Email" name="email" type="email" />
          {role === "hospital" && <Field label="Hospital or clinic" name="org" />}
          {role === "doctor" && <Field label="Specialty" name="specialty" />}
          {role === "press" && <Field label="Publication" name="publication" />}
          <Field label="Message" name="message" textarea />

          <button
            type="submit"
            className="mt-3 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-white text-sm font-semibold hover:bg-ocean transition-colors"
            data-hover
          >
            Send message
            <span aria-hidden>→</span>
          </button>
        </>
      )}
    </motion.form>
  );
}

function Field({
  label,
  name,
  type = "text",
  textarea = false,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <label className="block mb-5">
      <span
        className={`block text-[10px] tracking-[0.22em] uppercase font-semibold transition-colors duration-300 ${
          focused ? "text-ocean" : "text-muted"
        }`}
      >
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          rows={4}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required
          className="w-full mt-1.5 bg-transparent border-b border-ink/20 focus:border-ocean py-2 outline-none transition-colors text-[15px] text-ink resize-none"
        />
      ) : (
        <input
          name={name}
          type={type}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required
          className="w-full mt-1.5 bg-transparent border-b border-ink/20 focus:border-ocean py-2 outline-none transition-colors text-[15px] text-ink"
        />
      )}
    </label>
  );
}
