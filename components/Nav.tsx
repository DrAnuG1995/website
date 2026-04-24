"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const links = [
  { href: "/#platform", label: "For Doctors" },
  { href: "/hospitals", label: "For Hospitals" },
  { href: "/partners", label: "Partners" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1], delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-500 ${
        scrolled
          ? "bg-bone/75 backdrop-blur-xl border-b border-ink/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-8 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2" data-hover>
          <span className="display text-2xl tracking-tight">StatDoctor</span>
          <span className="w-2 h-2 rounded-full bg-electric animate-pulse-dot" />
        </Link>

        <nav className="hidden md:flex gap-8 text-sm font-medium">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="link-underline py-1" data-hover>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="#founder"
            className="group flex items-center gap-2 pr-4 pl-1 py-1 rounded-full bg-gauze hover:bg-ink hover:text-bone transition-all duration-300"
            data-hover
          >
            <span className="relative w-7 h-7 rounded-full bg-gradient-to-br from-ocean to-light-blue grid place-items-center text-bone display text-sm">
              A
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-electric ring-2 ring-bone animate-pulse-dot" />
            </span>
            <span className="text-xs font-medium">Founder message</span>
          </Link>
          <Link
            href="https://linktr.ee/statdoctorau"
            className="px-5 py-2.5 rounded-full bg-ink text-bone text-sm font-medium hover:bg-ocean transition-colors duration-300"
            data-hover
          >
            Download App
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden w-10 h-10 grid place-items-center"
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-1.5">
            <span className={`block w-5 h-0.5 bg-ink transition-transform ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-ink transition-transform ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden bg-bone border-t border-ink/10 overflow-hidden"
        >
          <div className="flex flex-col gap-1 p-6">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-3 border-b border-ink/10">
                {l.label}
              </Link>
            ))}
            <Link
              href="https://linktr.ee/statdoctorau"
              className="mt-4 px-5 py-3 rounded-full bg-ink text-bone text-center text-sm font-medium"
            >
              Download App
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
