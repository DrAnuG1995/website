"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DownloadModal from "./DownloadModal";

const NAV_LINKS = [
  { href: "/for-doctors", label: "Doctors" },
  { href: "/hospitals", label: "Hospitals" },
  { href: "/partners", label: "Partners" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const onOpen = () => setDownloadOpen(true);
    window.addEventListener("open-download-modal", onOpen);
    return () => window.removeEventListener("open-download-modal", onOpen);
  }, []);

  // Close mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1], delay: 0.15 }}
      className="fixed top-3 md:top-5 left-0 right-0 z-[90] flex justify-center px-3 md:px-6"
    >
      <motion.div
        initial={{ maxWidth: 1280 }}
        animate={{ maxWidth: scrolled ? 880 : 1280 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative flex items-center justify-between gap-2 md:gap-4 rounded-full bg-white/85 backdrop-blur-xl border border-ink/10 shadow-[0_10px_40px_-15px_rgba(26,26,46,0.18)] px-3 md:px-5 py-1.5 w-full"
      >
        {/* Logo — always visible */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          data-hover
          aria-label="StatDoctor home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/statdoctor-logo.png"
            alt="StatDoctor"
            className="h-8 md:h-9 w-auto"
          />
        </Link>

        {/* Desktop menu — absolutely centered to the nav pill so the
            center of the link cluster matches the pill's horizontal
            center, regardless of how wide the logo or right-group are. */}
        <div className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-semibold absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative transition-colors text-ink hover:text-ocean ${
                isActive(link.href) ? "text-ocean" : ""
              }`}
              data-hover
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-ocean" />
              )}
            </Link>
          ))}
        </div>

        {/* Right group: Log in (desktop) + Download */}
        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          <a
            href="https://hospital.statdoctor.app/#/login"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex px-3 lg:px-4 py-2 text-sm font-medium text-ink hover:text-ocean transition-colors"
            data-hover
          >
            Log in
          </a>
          <button
            onClick={() => setDownloadOpen(true)}
            className="px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-ocean text-white text-xs md:text-sm font-semibold hover:bg-ink transition-colors whitespace-nowrap"
            data-hover
          >
            <span className="md:hidden">Download</span>
            <span className="hidden md:inline">Download App</span>
          </button>
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="md:hidden ml-0.5 w-9 h-9 grid place-items-center rounded-full text-ink hover:bg-ink/5 transition-colors"
            data-hover
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden
            >
              {menuOpen ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </motion.div>

      {/* Mobile dropdown panel — fixed to the viewport (not the header's
          flex row) so it appears reliably below the nav pill regardless of
          the parent's layout context. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="md:hidden fixed top-[68px] left-3 right-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-ink/10 shadow-[0_20px_60px_-15px_rgba(26,26,46,0.2)] p-2"
          >
            <nav className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-xl text-[15px] font-semibold transition-colors ${
                    isActive(link.href)
                      ? "bg-ocean/8 text-ocean"
                      : "text-ink hover:bg-ink/5"
                  }`}
                  data-hover
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://hospital.statdoctor.app/#/login"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl text-[15px] font-medium text-ink hover:bg-ink/5 transition-colors"
                data-hover
              >
                Log in
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <DownloadModal open={downloadOpen} onClose={() => setDownloadOpen(false)} />
    </motion.header>
  );
}
