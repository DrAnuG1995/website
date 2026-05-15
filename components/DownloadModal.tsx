"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IOS_URL = "https://apps.apple.com/au/app/statdoctor/id6452677138";
const ANDROID_URL =
  "https://play.google.com/store/apps/details?id=user.statdoctor.app&hl=en_AU";

// QR encodes https://linktr.ee/statdoctorau, regenerate via public/app-qr.svg
const QR_PATH = "M 24,24 l 24,0 0,24 -24,0 z M 48,24 l 24,0 0,24 -24,0 z M 72,24 l 24,0 0,24 -24,0 z M 96,24 l 24,0 0,24 -24,0 z M 120,24 l 24,0 0,24 -24,0 z M 144,24 l 24,0 0,24 -24,0 z M 168,24 l 24,0 0,24 -24,0 z M 240,24 l 24,0 0,24 -24,0 z M 264,24 l 24,0 0,24 -24,0 z M 288,24 l 24,0 0,24 -24,0 z M 336,24 l 24,0 0,24 -24,0 z M 456,24 l 24,0 0,24 -24,0 z M 480,24 l 24,0 0,24 -24,0 z M 504,24 l 24,0 0,24 -24,0 z M 528,24 l 24,0 0,24 -24,0 z M 552,24 l 24,0 0,24 -24,0 z M 576,24 l 24,0 0,24 -24,0 z M 600,24 l 24,0 0,24 -24,0 z M 24,48 l 24,0 0,24 -24,0 z M 168,48 l 24,0 0,24 -24,0 z M 216,48 l 24,0 0,24 -24,0 z M 240,48 l 24,0 0,24 -24,0 z M 264,48 l 24,0 0,24 -24,0 z M 336,48 l 24,0 0,24 -24,0 z M 360,48 l 24,0 0,24 -24,0 z M 384,48 l 24,0 0,24 -24,0 z M 408,48 l 24,0 0,24 -24,0 z M 456,48 l 24,0 0,24 -24,0 z M 600,48 l 24,0 0,24 -24,0 z M 24,72 l 24,0 0,24 -24,0 z M 72,72 l 24,0 0,24 -24,0 z M 96,72 l 24,0 0,24 -24,0 z M 120,72 l 24,0 0,24 -24,0 z M 168,72 l 24,0 0,24 -24,0 z M 240,72 l 24,0 0,24 -24,0 z M 264,72 l 24,0 0,24 -24,0 z M 312,72 l 24,0 0,24 -24,0 z M 360,72 l 24,0 0,24 -24,0 z M 384,72 l 24,0 0,24 -24,0 z M 408,72 l 24,0 0,24 -24,0 z M 456,72 l 24,0 0,24 -24,0 z M 504,72 l 24,0 0,24 -24,0 z M 528,72 l 24,0 0,24 -24,0 z M 552,72 l 24,0 0,24 -24,0 z M 600,72 l 24,0 0,24 -24,0 z M 24,96 l 24,0 0,24 -24,0 z M 72,96 l 24,0 0,24 -24,0 z M 96,96 l 24,0 0,24 -24,0 z M 120,96 l 24,0 0,24 -24,0 z M 168,96 l 24,0 0,24 -24,0 z M 216,96 l 24,0 0,24 -24,0 z M 240,96 l 24,0 0,24 -24,0 z M 312,96 l 24,0 0,24 -24,0 z M 336,96 l 24,0 0,24 -24,0 z M 360,96 l 24,0 0,24 -24,0 z M 384,96 l 24,0 0,24 -24,0 z M 456,96 l 24,0 0,24 -24,0 z M 504,96 l 24,0 0,24 -24,0 z M 528,96 l 24,0 0,24 -24,0 z M 552,96 l 24,0 0,24 -24,0 z M 600,96 l 24,0 0,24 -24,0 z M 24,120 l 24,0 0,24 -24,0 z M 72,120 l 24,0 0,24 -24,0 z M 96,120 l 24,0 0,24 -24,0 z M 120,120 l 24,0 0,24 -24,0 z M 168,120 l 24,0 0,24 -24,0 z M 288,120 l 24,0 0,24 -24,0 z M 360,120 l 24,0 0,24 -24,0 z M 408,120 l 24,0 0,24 -24,0 z M 456,120 l 24,0 0,24 -24,0 z M 504,120 l 24,0 0,24 -24,0 z M 528,120 l 24,0 0,24 -24,0 z M 552,120 l 24,0 0,24 -24,0 z M 600,120 l 24,0 0,24 -24,0 z M 24,144 l 24,0 0,24 -24,0 z M 168,144 l 24,0 0,24 -24,0 z M 216,144 l 24,0 0,24 -24,0 z M 264,144 l 24,0 0,24 -24,0 z M 312,144 l 24,0 0,24 -24,0 z M 336,144 l 24,0 0,24 -24,0 z M 384,144 l 24,0 0,24 -24,0 z M 408,144 l 24,0 0,24 -24,0 z M 456,144 l 24,0 0,24 -24,0 z M 600,144 l 24,0 0,24 -24,0 z M 24,168 l 24,0 0,24 -24,0 z M 48,168 l 24,0 0,24 -24,0 z M 72,168 l 24,0 0,24 -24,0 z M 96,168 l 24,0 0,24 -24,0 z M 120,168 l 24,0 0,24 -24,0 z M 144,168 l 24,0 0,24 -24,0 z M 168,168 l 24,0 0,24 -24,0 z M 216,168 l 24,0 0,24 -24,0 z M 264,168 l 24,0 0,24 -24,0 z M 312,168 l 24,0 0,24 -24,0 z M 360,168 l 24,0 0,24 -24,0 z M 408,168 l 24,0 0,24 -24,0 z M 456,168 l 24,0 0,24 -24,0 z M 480,168 l 24,0 0,24 -24,0 z M 504,168 l 24,0 0,24 -24,0 z M 528,168 l 24,0 0,24 -24,0 z M 552,168 l 24,0 0,24 -24,0 z M 576,168 l 24,0 0,24 -24,0 z M 600,168 l 24,0 0,24 -24,0 z M 288,192 l 24,0 0,24 -24,0 z M 312,192 l 24,0 0,24 -24,0 z M 360,192 l 24,0 0,24 -24,0 z M 384,192 l 24,0 0,24 -24,0 z M 408,192 l 24,0 0,24 -24,0 z M 24,216 l 24,0 0,24 -24,0 z M 48,216 l 24,0 0,24 -24,0 z M 72,216 l 24,0 0,24 -24,0 z M 96,216 l 24,0 0,24 -24,0 z M 120,216 l 24,0 0,24 -24,0 z M 168,216 l 24,0 0,24 -24,0 z M 192,216 l 24,0 0,24 -24,0 z M 216,216 l 24,0 0,24 -24,0 z M 240,216 l 24,0 0,24 -24,0 z M 264,216 l 24,0 0,24 -24,0 z M 336,216 l 24,0 0,24 -24,0 z M 360,216 l 24,0 0,24 -24,0 z M 384,216 l 24,0 0,24 -24,0 z M 432,216 l 24,0 0,24 -24,0 z M 480,216 l 24,0 0,24 -24,0 z M 528,216 l 24,0 0,24 -24,0 z M 576,216 l 24,0 0,24 -24,0 z M 96,240 l 24,0 0,24 -24,0 z M 120,240 l 24,0 0,24 -24,0 z M 240,240 l 24,0 0,24 -24,0 z M 288,240 l 24,0 0,24 -24,0 z M 360,240 l 24,0 0,24 -24,0 z M 408,240 l 24,0 0,24 -24,0 z M 480,240 l 24,0 0,24 -24,0 z M 576,240 l 24,0 0,24 -24,0 z M 96,264 l 24,0 0,24 -24,0 z M 120,264 l 24,0 0,24 -24,0 z M 168,264 l 24,0 0,24 -24,0 z M 216,264 l 24,0 0,24 -24,0 z M 240,264 l 24,0 0,24 -24,0 z M 360,264 l 24,0 0,24 -24,0 z M 384,264 l 24,0 0,24 -24,0 z M 528,264 l 24,0 0,24 -24,0 z M 576,264 l 24,0 0,24 -24,0 z M 600,264 l 24,0 0,24 -24,0 z M 24,288 l 24,0 0,24 -24,0 z M 144,288 l 24,0 0,24 -24,0 z M 192,288 l 24,0 0,24 -24,0 z M 216,288 l 24,0 0,24 -24,0 z M 240,288 l 24,0 0,24 -24,0 z M 264,288 l 24,0 0,24 -24,0 z M 288,288 l 24,0 0,24 -24,0 z M 408,288 l 24,0 0,24 -24,0 z M 432,288 l 24,0 0,24 -24,0 z M 456,288 l 24,0 0,24 -24,0 z M 480,288 l 24,0 0,24 -24,0 z M 504,288 l 24,0 0,24 -24,0 z M 600,288 l 24,0 0,24 -24,0 z M 48,312 l 24,0 0,24 -24,0 z M 96,312 l 24,0 0,24 -24,0 z M 168,312 l 24,0 0,24 -24,0 z M 240,312 l 24,0 0,24 -24,0 z M 288,312 l 24,0 0,24 -24,0 z M 312,312 l 24,0 0,24 -24,0 z M 336,312 l 24,0 0,24 -24,0 z M 360,312 l 24,0 0,24 -24,0 z M 432,312 l 24,0 0,24 -24,0 z M 456,312 l 24,0 0,24 -24,0 z M 504,312 l 24,0 0,24 -24,0 z M 552,312 l 24,0 0,24 -24,0 z M 576,312 l 24,0 0,24 -24,0 z M 600,312 l 24,0 0,24 -24,0 z M 24,336 l 24,0 0,24 -24,0 z M 48,336 l 24,0 0,24 -24,0 z M 72,336 l 24,0 0,24 -24,0 z M 96,336 l 24,0 0,24 -24,0 z M 216,336 l 24,0 0,24 -24,0 z M 264,336 l 24,0 0,24 -24,0 z M 288,336 l 24,0 0,24 -24,0 z M 480,336 l 24,0 0,24 -24,0 z M 528,336 l 24,0 0,24 -24,0 z M 576,336 l 24,0 0,24 -24,0 z M 24,360 l 24,0 0,24 -24,0 z M 168,360 l 24,0 0,24 -24,0 z M 192,360 l 24,0 0,24 -24,0 z M 312,360 l 24,0 0,24 -24,0 z M 384,360 l 24,0 0,24 -24,0 z M 432,360 l 24,0 0,24 -24,0 z M 480,360 l 24,0 0,24 -24,0 z M 504,360 l 24,0 0,24 -24,0 z M 528,360 l 24,0 0,24 -24,0 z M 576,360 l 24,0 0,24 -24,0 z M 600,360 l 24,0 0,24 -24,0 z M 24,384 l 24,0 0,24 -24,0 z M 72,384 l 24,0 0,24 -24,0 z M 96,384 l 24,0 0,24 -24,0 z M 144,384 l 24,0 0,24 -24,0 z M 192,384 l 24,0 0,24 -24,0 z M 240,384 l 24,0 0,24 -24,0 z M 360,384 l 24,0 0,24 -24,0 z M 480,384 l 24,0 0,24 -24,0 z M 504,384 l 24,0 0,24 -24,0 z M 600,384 l 24,0 0,24 -24,0 z M 24,408 l 24,0 0,24 -24,0 z M 72,408 l 24,0 0,24 -24,0 z M 120,408 l 24,0 0,24 -24,0 z M 144,408 l 24,0 0,24 -24,0 z M 168,408 l 24,0 0,24 -24,0 z M 192,408 l 24,0 0,24 -24,0 z M 216,408 l 24,0 0,24 -24,0 z M 240,408 l 24,0 0,24 -24,0 z M 336,408 l 24,0 0,24 -24,0 z M 360,408 l 24,0 0,24 -24,0 z M 384,408 l 24,0 0,24 -24,0 z M 408,408 l 24,0 0,24 -24,0 z M 432,408 l 24,0 0,24 -24,0 z M 456,408 l 24,0 0,24 -24,0 z M 480,408 l 24,0 0,24 -24,0 z M 504,408 l 24,0 0,24 -24,0 z M 552,408 l 24,0 0,24 -24,0 z M 216,432 l 24,0 0,24 -24,0 z M 264,432 l 24,0 0,24 -24,0 z M 288,432 l 24,0 0,24 -24,0 z M 360,432 l 24,0 0,24 -24,0 z M 408,432 l 24,0 0,24 -24,0 z M 504,432 l 24,0 0,24 -24,0 z M 528,432 l 24,0 0,24 -24,0 z M 24,456 l 24,0 0,24 -24,0 z M 48,456 l 24,0 0,24 -24,0 z M 72,456 l 24,0 0,24 -24,0 z M 96,456 l 24,0 0,24 -24,0 z M 120,456 l 24,0 0,24 -24,0 z M 144,456 l 24,0 0,24 -24,0 z M 168,456 l 24,0 0,24 -24,0 z M 216,456 l 24,0 0,24 -24,0 z M 264,456 l 24,0 0,24 -24,0 z M 360,456 l 24,0 0,24 -24,0 z M 408,456 l 24,0 0,24 -24,0 z M 456,456 l 24,0 0,24 -24,0 z M 504,456 l 24,0 0,24 -24,0 z M 552,456 l 24,0 0,24 -24,0 z M 576,456 l 24,0 0,24 -24,0 z M 600,456 l 24,0 0,24 -24,0 z M 24,480 l 24,0 0,24 -24,0 z M 168,480 l 24,0 0,24 -24,0 z M 264,480 l 24,0 0,24 -24,0 z M 288,480 l 24,0 0,24 -24,0 z M 312,480 l 24,0 0,24 -24,0 z M 408,480 l 24,0 0,24 -24,0 z M 504,480 l 24,0 0,24 -24,0 z M 528,480 l 24,0 0,24 -24,0 z M 24,504 l 24,0 0,24 -24,0 z M 72,504 l 24,0 0,24 -24,0 z M 96,504 l 24,0 0,24 -24,0 z M 120,504 l 24,0 0,24 -24,0 z M 168,504 l 24,0 0,24 -24,0 z M 216,504 l 24,0 0,24 -24,0 z M 312,504 l 24,0 0,24 -24,0 z M 336,504 l 24,0 0,24 -24,0 z M 360,504 l 24,0 0,24 -24,0 z M 384,504 l 24,0 0,24 -24,0 z M 408,504 l 24,0 0,24 -24,0 z M 432,504 l 24,0 0,24 -24,0 z M 456,504 l 24,0 0,24 -24,0 z M 480,504 l 24,0 0,24 -24,0 z M 504,504 l 24,0 0,24 -24,0 z M 552,504 l 24,0 0,24 -24,0 z M 576,504 l 24,0 0,24 -24,0 z M 24,528 l 24,0 0,24 -24,0 z M 72,528 l 24,0 0,24 -24,0 z M 96,528 l 24,0 0,24 -24,0 z M 120,528 l 24,0 0,24 -24,0 z M 168,528 l 24,0 0,24 -24,0 z M 216,528 l 24,0 0,24 -24,0 z M 240,528 l 24,0 0,24 -24,0 z M 264,528 l 24,0 0,24 -24,0 z M 288,528 l 24,0 0,24 -24,0 z M 384,528 l 24,0 0,24 -24,0 z M 432,528 l 24,0 0,24 -24,0 z M 456,528 l 24,0 0,24 -24,0 z M 504,528 l 24,0 0,24 -24,0 z M 528,528 l 24,0 0,24 -24,0 z M 552,528 l 24,0 0,24 -24,0 z M 576,528 l 24,0 0,24 -24,0 z M 600,528 l 24,0 0,24 -24,0 z M 24,552 l 24,0 0,24 -24,0 z M 72,552 l 24,0 0,24 -24,0 z M 96,552 l 24,0 0,24 -24,0 z M 120,552 l 24,0 0,24 -24,0 z M 168,552 l 24,0 0,24 -24,0 z M 216,552 l 24,0 0,24 -24,0 z M 360,552 l 24,0 0,24 -24,0 z M 528,552 l 24,0 0,24 -24,0 z M 552,552 l 24,0 0,24 -24,0 z M 600,552 l 24,0 0,24 -24,0 z M 24,576 l 24,0 0,24 -24,0 z M 168,576 l 24,0 0,24 -24,0 z M 216,576 l 24,0 0,24 -24,0 z M 264,576 l 24,0 0,24 -24,0 z M 288,576 l 24,0 0,24 -24,0 z M 408,576 l 24,0 0,24 -24,0 z M 480,576 l 24,0 0,24 -24,0 z M 504,576 l 24,0 0,24 -24,0 z M 528,576 l 24,0 0,24 -24,0 z M 600,576 l 24,0 0,24 -24,0 z M 24,600 l 24,0 0,24 -24,0 z M 48,600 l 24,0 0,24 -24,0 z M 72,600 l 24,0 0,24 -24,0 z M 96,600 l 24,0 0,24 -24,0 z M 120,600 l 24,0 0,24 -24,0 z M 144,600 l 24,0 0,24 -24,0 z M 168,600 l 24,0 0,24 -24,0 z M 216,600 l 24,0 0,24 -24,0 z M 240,600 l 24,0 0,24 -24,0 z M 264,600 l 24,0 0,24 -24,0 z M 288,600 l 24,0 0,24 -24,0 z M 312,600 l 24,0 0,24 -24,0 z M 336,600 l 24,0 0,24 -24,0 z M 360,600 l 24,0 0,24 -24,0 z M 432,600 l 24,0 0,24 -24,0 z M 480,600 l 24,0 0,24 -24,0 z M 504,600 l 24,0 0,24 -24,0 z M 528,600 l 24,0 0,24 -24,0 z M 552,600 l 24,0 0,24 -24,0 z M 576,600 l 24,0 0,24 -24,0 z M 600,600 l 24,0 0,24 -24,0 z";

export default function DownloadModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] grid place-items-center px-4"
        >
          <button
            aria-label="Close download dialog"
            onClick={onClose}
            className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Download StatDoctor"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative w-full max-w-md rounded-3xl bg-white border border-ink/10 shadow-[0_50px_120px_-30px_rgba(26,26,46,0.45)] p-7 md:p-8"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 w-9 h-9 grid place-items-center rounded-full hover:bg-ink/5 text-ink/60 hover:text-ink transition-colors text-lg"
            >
              ×
            </button>

            <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-2">
              Get the app
            </div>
            <h2 className="display text-[clamp(22px,3vw,28px)] leading-[1.05]">
              Locum shifts in your pocket.
            </h2>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Verified by AHPRA. Browse shifts, see the rate upfront, apply in a
              tap. Free to download.
            </p>

            {/* Scan-with-phone QR, desktop users tap their phone, skip the
                browser-to-store handoff. Encodes the linktr.ee landing page so
                it routes to the right store automatically. */}
            <div className="mt-5 flex items-center gap-4 p-4 rounded-2xl bg-bone border border-ink/8">
              <div className="relative w-[104px] h-[104px] shrink-0 rounded-xl bg-white border border-ink/10 p-2">
                <svg
                  viewBox="0 0 648 648"
                  role="img"
                  aria-label="QR code to download StatDoctor"
                  className="w-full h-full"
                >
                  <path fill="#1A1A2E" d={QR_PATH} />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-1">
                  Scan with your phone
                </div>
                <div className="display text-[16px] leading-tight">
                  Opens the App Store or Google Play.
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <a
                href={IOS_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-ink text-white hover:bg-ocean transition-colors group"
                data-hover
              >
                <AppleGlyph />
                <div className="flex-1 text-left">
                  <div className="text-[10px] tracking-[0.18em] uppercase opacity-70">
                    Get it on
                  </div>
                  <div className="text-base font-semibold leading-tight">
                    App Store
                  </div>
                </div>
                <span aria-hidden className="text-lg opacity-70 group-hover:translate-x-0.5 transition-transform">
                  →
                </span>
              </a>

              <a
                href={ANDROID_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-ocean text-white hover:bg-ink transition-colors group"
                data-hover
              >
                <PlayGlyph />
                <div className="flex-1 text-left">
                  <div className="text-[10px] tracking-[0.18em] uppercase opacity-80">
                    Get it on
                  </div>
                  <div className="text-base font-semibold leading-tight">
                    Google Play
                  </div>
                </div>
                <span aria-hidden className="text-lg opacity-80 group-hover:translate-x-0.5 transition-transform">
                  →
                </span>
              </a>
            </div>

            <div className="mt-5 pt-5 border-t border-ink/8 text-[11px] text-muted text-center">
              Hospital admin?{" "}
              <a
                href="/hospitals"
                onClick={onClose}
                className="text-ocean hover:underline font-medium"
              >
                See StatDoctor for hospitals →
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AppleGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.365 1.43c0 1.14-.43 2.23-1.13 3.04-.85.99-2.23 1.76-3.36 1.66-.14-1.1.41-2.27 1.13-3.05.81-.92 2.27-1.65 3.36-1.65zM20.5 17.4c-.55 1.27-.81 1.83-1.51 2.95-.98 1.55-2.36 3.48-4.07 3.5-1.52.02-1.91-.99-3.97-.97-2.07.01-2.49 1-4.02.98-1.71-.02-3.02-1.77-4-3.32-2.74-4.32-3.03-9.4-1.34-12.1 1.2-1.93 3.1-3.06 4.88-3.06 1.82 0 2.96.99 4.46.99 1.46 0 2.35-.99 4.45-.99 1.59 0 3.27.86 4.47 2.36-3.93 2.16-3.29 7.82.65 9.66z" />
    </svg>
  );
}

function PlayGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M3.6 1.5c-.3.3-.5.7-.5 1.3v18.4c0 .6.2 1 .5 1.3l10.7-10.5L3.6 1.5zm12 8.4L5.6 1.4l11.7 6.7-1.7 1.8zm3 1.6l-2.4-1.4-1.9 1.9 1.9 1.9 2.4-1.4c.7-.4.7-1.6 0-2zm-12.7 11l10.1-9.7-1.7-1.8L5.9 22.5z"
      />
    </svg>
  );
}
