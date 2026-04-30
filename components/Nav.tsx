"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!signupOpen) return;
    const onClick = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) setSignupOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [signupOpen]);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1], delay: 0.15 }}
      className="fixed top-3 md:top-5 left-0 right-0 z-[90] flex justify-center px-3 md:px-6"
    >
      <motion.div
        animate={{
          width: scrolled ? "auto" : "100%",
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
          <div ref={popRef} className="relative">
            <button
              onClick={() => setSignupOpen((v) => !v)}
              className="px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-ocean text-white text-xs md:text-sm font-semibold hover:bg-ink transition-colors"
              data-hover
              aria-expanded={signupOpen}
            >
              Sign up
            </button>
            <AnimatePresence>
              {signupOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
                  className="absolute right-0 top-full mt-3 w-64 rounded-2xl bg-white border border-ink/10 shadow-[0_30px_80px_-20px_rgba(26,26,46,0.25)] overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-ink/8 bg-bone/40">
                    <div className="text-[10px] tracking-[0.22em] uppercase text-muted">Sign up as</div>
                  </div>
                  <Link
                    href="https://linktr.ee/statdoctorau"
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-ocean hover:text-white transition-colors group"
                    onClick={() => setSignupOpen(false)}
                  >
                    <div>
                      <div className="text-sm font-semibold">I&apos;m a doctor</div>
                      <div className="text-[11px] text-muted group-hover:text-white/75">Find shifts on your terms</div>
                    </div>
                    <span className="text-base">→</span>
                  </Link>
                  <Link
                    href="/hospitals"
                    className="flex items-center justify-between gap-3 px-4 py-3 border-t border-ink/8 hover:bg-ocean hover:text-white transition-colors group"
                    onClick={() => setSignupOpen(false)}
                  >
                    <div>
                      <div className="text-sm font-semibold">I&apos;m a hospital</div>
                      <div className="text-[11px] text-muted group-hover:text-white/75">Fill shifts in 30 minutes</div>
                    </div>
                    <span className="text-base">→</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}
