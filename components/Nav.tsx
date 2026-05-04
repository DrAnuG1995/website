"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DownloadModal from "./DownloadModal";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);

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
          maxWidth: scrolled ? 720 : 1280,
          paddingLeft: scrolled ? 14 : 18,
          paddingRight: scrolled ? 8 : 10,
        }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="flex items-center justify-between gap-3 rounded-full bg-white/85 backdrop-blur-xl border border-ink/10 shadow-[0_10px_40px_-15px_rgba(26,26,46,0.18)] py-1.5 w-full"
      >
        <Link href="/" className="flex items-center gap-2 pl-1" data-hover>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/statdoctor-logo.png"
            alt="StatDoctor"
            className="h-7 md:h-8 w-auto"
          />
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          <Link
            href="https://app.statdoctor.app/login"
            className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-ink/80 hover:text-ocean transition-colors"
            data-hover
          >
            Log in
          </Link>
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
