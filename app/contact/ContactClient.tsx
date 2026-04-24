"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import SplitText from "@/components/SplitText";
import MagneticButton from "@/components/MagneticButton";

export default function ContactClient() {
  const [sent, setSent] = useState(false);
  const [role, setRole] = useState<"doctor" | "hospital" | "other">("hospital");

  return (
    <>
      <section className="pt-40 pb-10 px-6">
        <div className="max-w-[1080px] mx-auto">
          <div className="eyebrow mb-4" data-mascot="Tell us a bit — we'll get back within a day.">Get in touch</div>
          <h1 className="display text-[clamp(48px,8vw,120px)] leading-[0.95]">
            <SplitText>Let&apos;s talk.</SplitText>
            <br />
            <SplitText start={0.5} className="italic text-ocean">No scripts.</SplitText>
          </h1>
        </div>
      </section>

      <section className="pb-32 px-6">
        <div className="max-w-[1080px] mx-auto grid md:grid-cols-[1fr_1.4fr] gap-16 items-start">
          <div className="space-y-8 md:sticky md:top-28 md:self-start">
            <ContactItem label="Hospitals" value="partnerships@statdoctor.net" href="mailto:partnerships@statdoctor.net" />
            <ContactItem label="Doctors" value="hello@statdoctor.net" href="mailto:hello@statdoctor.net" />
            <ContactItem label="Press" value="press@statdoctor.net" href="mailto:press@statdoctor.net" />
            <div className="pt-6 border-t border-ink/10">
              <div className="eyebrow mb-3">Office</div>
              <div className="text-sm leading-relaxed">
                Level 2, Collins St
                <br />
                Melbourne VIC 3000
                <br />
                Australia
              </div>
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="p-8 md:p-10 bg-gauze border border-ink/10 rounded-3xl"
          >
            {sent ? (
              <div className="py-12 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 180, damping: 14 }}
                  className="w-20 h-20 mx-auto rounded-full bg-electric grid place-items-center mb-6"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
                <h3 className="display text-3xl">Message sent.</h3>
                <p className="mt-2 text-muted">We&apos;ll reply within one business day.</p>
              </div>
            ) : (
              <>
                <div className="eyebrow mb-2">I am a</div>
                <div className="flex gap-2 mb-6 flex-wrap">
                  {(["hospital", "doctor", "other"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`px-4 py-2 rounded-full mono text-[11px] tracking-widest transition-all duration-300 ${
                        role === r ? "bg-ink text-bone" : "bg-bone hover:bg-ink hover:text-bone border border-ink/15"
                      }`}
                      data-hover
                    >
                      {r.toUpperCase()}
                    </button>
                  ))}
                </div>

                <Field label="Name" name="name" />
                <Field label="Email" name="email" type="email" />
                {role === "hospital" && <Field label="Hospital / organisation" name="org" />}
                {role === "doctor" && <Field label="Specialty" name="specialty" />}
                <Field label="Message" name="message" textarea />

                <div className="mt-6">
                  <MagneticButton variant="primary">Send message →</MagneticButton>
                </div>
              </>
            )}
          </motion.form>
        </div>
      </section>
    </>
  );
}

function ContactItem({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <div>
      <div className="eyebrow mb-1">{label}</div>
      <a href={href} className="display text-2xl link-underline" data-hover>
        {value}
      </a>
    </div>
  );
}

function Field({ label, name, type = "text", textarea = false }: { label: string; name: string; type?: string; textarea?: boolean }) {
  const [focused, setFocused] = useState(false);
  const Comp: any = textarea ? "textarea" : "input";
  return (
    <label className="block mb-5 relative">
      <span className={`mono text-[10px] tracking-widest uppercase transition-colors duration-300 ${focused ? "text-ocean" : "text-muted"}`}>{label}</span>
      <Comp
        name={name}
        type={textarea ? undefined : type}
        rows={textarea ? 4 : undefined}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full mt-1.5 bg-transparent border-b border-ink/20 focus:border-ink py-2 outline-none transition-colors font-sans text-base resize-none"
        required
      />
    </label>
  );
}
