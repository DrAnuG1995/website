"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DownloadModal from "./DownloadModal";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const pathname = usePathname();
  const onDoctors = pathname?.startsWith("/for-doctors");
  const onHospitals = pathname?.startsWith("/hospitals");

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

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1], delay: 0.15 }}
      className="fixed top-3 md:top-5 left-0 right-0 z-[90] flex justify-center px-3 md:px-6"
    >
      <motion.div
        initial={{ maxWidth: 1280, paddingLeft: 18, paddingRight: 10 }}
        animate={{
          maxWidth: scrolled ? 880 : 1280,
          paddingLeft: scrolled ? 14 : 18,
          paddingRight: scrolled ? 8 : 10,
        }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-full bg-white/85 backdrop-blur-xl border border-ink/10 shadow-[0_10px_40px_-15px_rgba(26,26,46,0.18)] py-1.5 w-full"
      >
        <Link href="/" className="flex items-center gap-2 pl-1 justify-self-start" data-hover>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/statdoctor-logo.png"
            alt="StatDoctor"
            className="h-8 md:h-9 w-auto"
          />
        </Link>

        <div className="flex items-center gap-3 md:gap-4 justify-self-center text-xs md:text-sm font-semibold">
          <Link
            href="/for-doctors"
            className={`transition-colors text-ink hover:text-ink/70 ${
              onDoctors ? "underline underline-offset-4 decoration-2" : ""
            }`}
            data-hover
          >
            Doctors
          </Link>
          <span aria-hidden className="h-4 w-px bg-ink/25 select-none" />
          <Link
            href="/hospitals"
            className={`transition-colors text-ink hover:text-ink/70 ${
              onHospitals ? "underline underline-offset-4 decoration-2" : ""
            }`}
            data-hover
          >
            Hospitals
          </Link>
        </div>

        <div className="flex items-center gap-1 md:gap-2 justify-self-end">
          <a
            href="https://hospital.statdoctor.app/#/login"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-ink hover:text-ink/70 transition-colors"
            data-hover
          >
            Log in
          </a>
          <button
            onClick={() => setDownloadOpen(true)}
            className="px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-ocean text-white text-xs md:text-sm font-semibold hover:bg-ink transition-colors"
            data-hover
          >
            Download App
          </button>
        </div>
      </motion.div>

      <DownloadModal open={downloadOpen} onClose={() => setDownloadOpen(false)} />
    </motion.header>
  );
}
