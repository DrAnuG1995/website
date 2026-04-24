"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-ink text-bone pt-20 pb-10 relative z-10">
      <div className="max-w-[1280px] mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "150px" }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-[1.4fr_2fr] gap-16 pb-12 border-b border-bone/12"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="display text-3xl tracking-tight">StatDoctor</span>
              <span className="w-2 h-2 rounded-full bg-electric animate-pulse-dot" />
            </div>
            <p className="text-parchment text-sm max-w-xs leading-relaxed">
              Australia's first locum doctor marketplace. Built by doctors, for doctors. No agencies, no hidden fees.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://apps.apple.com/au/app/statdoctor/id6452677138"
                target="_blank"
                rel="noopener"
                className="px-4 py-2 rounded-full border border-bone/20 text-xs mono tracking-widest hover:bg-bone hover:text-ink transition"
                data-hover
              >
                APP STORE →
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=user.statdoctor.app&hl=en_AU"
                target="_blank"
                rel="noopener"
                className="px-4 py-2 rounded-full border border-bone/20 text-xs mono tracking-widest hover:bg-bone hover:text-ink transition"
                data-hover
              >
                GOOGLE PLAY →
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <FooterCol
              title="Platform"
              links={[
                { href: "/#platform", label: "For Doctors" },
                { href: "/hospitals", label: "For Hospitals" },
                { href: "/partners", label: "Partners" },
              ]}
            />
            <FooterCol
              title="Resources"
              links={[
                { href: "/blog", label: "Blog" },
                { href: "/contact", label: "Contact" },
              ]}
            />
            <FooterCol
              title="Legal"
              links={[
                { href: "/terms-of-use", label: "Terms" },
                { href: "/privacy-policy", label: "Privacy" },
              ]}
            />
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 mono text-xs tracking-widest text-parchment">
          <span>© 2026 STATDOCTOR · ABN 00 000 000 000</span>
          <span>MADE IN AUSTRALIA 🇦🇺</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h5 className="mono text-xs tracking-widest text-parchment uppercase mb-4">{title}</h5>
      <div className="flex flex-col gap-2">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="text-sm opacity-80 hover:opacity-100 hover:text-electric transition-colors" data-hover>
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
