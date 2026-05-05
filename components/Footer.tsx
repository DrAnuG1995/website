"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative bg-ink text-bone overflow-hidden">
      {/* Soft electric halo top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 w-[640px] h-[640px] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(205,227,93,0.4), transparent 65%)",
        }}
      />

      {/* Top: massive editorial wordmark */}
      <div className="relative max-w-[1320px] mx-auto px-6 md:px-8 pt-24 md:pt-32 pb-16 border-b border-bone/10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="grid md:grid-cols-[2fr_1fr] gap-10 md:gap-16 items-end"
        >
          <div>
            <div className="text-[10px] tracking-[0.22em] uppercase text-bone/50 mb-4">
              Built by doctors, for doctors
            </div>
            <h2 className="display text-[clamp(40px,7.5vw,120px)] leading-[0.92] tracking-tight">
              StatDoctor.
            </h2>
            <p className="mt-5 max-w-md text-sm text-bone/70 leading-relaxed">
              Australia&apos;s first locum doctor marketplace. No agencies, no hidden fees, zero commission, ever.
            </p>
          </div>
          <div className="flex flex-col gap-2 md:items-end">
            <Link
              href="/for-doctors"
              className="inline-flex items-center justify-center gap-2 w-[210px] px-5 py-3 rounded-full bg-electric text-ink text-xs md:text-sm font-semibold hover:bg-ocean hover:text-white transition-colors"
              data-hover
            >
              Join as a doctor →
            </Link>
            <Link
              href="/hospitals"
              className="inline-flex items-center justify-center gap-2 w-[210px] px-5 py-3 rounded-full border border-bone/25 text-bone text-xs md:text-sm font-medium hover:bg-bone hover:text-ink hover:border-bone transition-colors"
              data-hover
            >
              Join as a hospital →
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Sitemap grid */}
      <div className="relative max-w-[1320px] mx-auto px-6 md:px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <FooterCol
          title="Platform"
          links={[
            { href: "/for-doctors", label: "For doctors" },
            { href: "/hospitals", label: "For hospitals" },
            { href: "/partners", label: "Partners" },
          ]}
        />
        <FooterCol
          title="Resources"
          links={[
            { href: "/blog", label: "Blog" },
            { href: "/contact", label: "Contact" },
            { href: "mailto:Admin@statdoctor.net", label: "Admin@statdoctor.net" },
          ]}
        />
        <FooterCol
          title="Legal"
          links={[
            { href: "/terms-of-use", label: "Terms of use" },
            { href: "/privacy-policy", label: "Privacy policy" },
          ]}
        />
        <FooterCol
          title="Get the app"
          links={[
            { href: "https://apps.apple.com/au/app/statdoctor/id6452677138", label: "App Store", external: true },
            { href: "https://play.google.com/store/apps/details?id=user.statdoctor.app&hl=en_AU", label: "Google Play", external: true },
            { href: "https://www.linkedin.com/company/statdoctor/", label: "LinkedIn", external: true },
            { href: "https://www.facebook.com/p/StatDoctor-100088461867629/", label: "Facebook", external: true },
          ]}
        />
      </div>

      {/* Bottom bar */}
      <div className="relative max-w-[1320px] mx-auto px-6 md:px-8 pb-10 pt-6 border-t border-bone/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs tracking-[0.22em] uppercase text-bone/50">
        <span>© 2026 StatDoctor</span>
        <span>Made in Australia</span>
        <span>ABN 63 671 408 692</span>
      </div>

      {/* Quiet accent strip */}
      <div className="relative border-t border-bone/10 overflow-hidden">
        <div className="flex gap-8 py-3 w-max animate-marquee-slow">
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="text-[10px] tracking-[0.28em] uppercase text-bone/30 whitespace-nowrap"
            >
              No agencies · Zero commission · Doctors keep 100% ·
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; external?: boolean }[];
}) {
  return (
    <div>
      <h5 className="text-[11px] tracking-[0.22em] uppercase text-bone/45 mb-5">{title}</h5>
      <ul className="flex flex-col gap-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noopener" } : {})}
              className="text-sm text-bone/85 hover:text-electric transition-colors inline-flex items-center gap-2 group"
              data-hover
            >
              <span>{l.label}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
