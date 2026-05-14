"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChatMessage from "./ChatMessage";
import { useChat } from "./useChat";

const SUGGESTED_PROMPTS = [
  "I'm a doctor",
  "I'm with a hospital or clinic",
  "Just have a question",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const { messages, sendMessage, isStreaming, clear } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // On mobile the bottom-right corner is always occupied by hero CTAs
  // (full-width buttons), so the launcher collides with them at rest.
  // Hide the pill until the user has scrolled past the hero; desktop
  // always shows it. Re-evaluated on resize so flipping the device
  // orientation does the right thing.
  const [pillVisible, setPillVisible] = useState(false);
  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 768) {
        setPillVisible(true);
      } else {
        setPillVisible(window.scrollY > window.innerHeight * 0.6);
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // ESC closes panel; lock body scroll on mobile only.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Autoscroll to bottom on new message / streaming tokens.
  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, open, isStreaming]);

  // Focus textarea when opening.
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
  }, [open]);

  const submit = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <>
      {/* Floating pill */}
      <AnimatePresence>
        {!open && pillVisible && (
          <motion.button
            key="chat-bubble"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={() => setOpen(true)}
            aria-label="Open StatDoctor chat"
            className="group fixed bottom-5 right-5 md:bottom-8 md:right-6 z-[95] flex items-center gap-2 h-12 pl-1 pr-4 rounded-full bg-ocean text-white shadow-[0_15px_45px_-10px_rgba(50,50,255,0.55)] hover:bg-ink transition-colors"
            data-hover
          >
            <DocAvatar size={40} />
            <span className="text-[13px] font-semibold tracking-tight pr-0.5">
              Have a question?
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed z-[100] bg-white border border-ink/10 shadow-[0_50px_120px_-30px_rgba(26,26,46,0.45)]
                       inset-0 md:inset-auto
                       md:bottom-6 md:right-6
                       md:w-[380px] md:h-[600px]
                       md:rounded-3xl
                       flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="StatDoctor chat"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-ink/8 bg-white">
              <div className="flex items-center gap-2.5">
                <DocAvatar size={36} />
                <div className="leading-tight">
                  <div className="text-[14px] font-semibold text-ink">
                    StatDoctor Assistant
                  </div>
                  <div className="text-[11px] text-muted">
                    Replies in seconds
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={clear}
                    aria-label="Clear conversation"
                    title="Clear conversation"
                    className="w-8 h-8 grid place-items-center rounded-full text-ink/50 hover:bg-ink/5 hover:text-ink transition-colors text-sm"
                  >
                    <ResetIcon />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="w-8 h-8 grid place-items-center rounded-full text-ink/60 hover:bg-ink/5 hover:text-ink transition-colors text-lg"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              data-lenis-prevent
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-white"
            >
              {/* Seeded greeting */}
              <div className="flex flex-col items-start gap-2">
                <div className="max-w-[92%] rounded-2xl rounded-bl-sm bg-lavender border border-ocean/10 px-4 py-2.5 text-[14px] leading-relaxed text-ink">
                  Hi, I&apos;m the StatDoctor assistant. So I can point you
                  in the right direction, are you a doctor, or with a
                  hospital or clinic?
                </div>
              </div>

              {messages.length === 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SUGGESTED_PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => sendMessage(p)}
                      className="text-[12px] px-3 py-1.5 rounded-full border border-ink/15 text-ink/80 hover:bg-bone hover:border-ink/25 transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m, i) => {
                const isLast = i === messages.length - 1;
                return (
                  <ChatMessage
                    key={m.id}
                    message={m}
                    isStreaming={isStreaming && isLast && m.role === "assistant"}
                  />
                );
              })}
            </div>

            {/* Composer */}
            <div className="border-t border-ink/8 bg-white px-3 pt-2 pb-2">
              <div className="flex items-center gap-1.5 rounded-full border border-ink/15 focus-within:border-ocean transition-colors pl-4 pr-1 py-1">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={1}
                  placeholder="Ask about pricing, coverage…"
                  className="flex-1 resize-none bg-transparent outline-none text-[13px] leading-5 text-ink placeholder:text-muted max-h-24 py-1 my-0 block"
                />
                <button
                  onClick={submit}
                  disabled={!input.trim() || isStreaming}
                  aria-label="Send message"
                  className="shrink-0 w-8 h-8 grid place-items-center rounded-full bg-ocean text-white disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-ink transition-colors"
                >
                  <SendIcon />
                </button>
              </div>
              <div className="mt-1 text-[10px] text-muted text-center">
                For urgent matters,{" "}
                <a
                  href="mailto:anu@statdoctor.net"
                  className="text-ocean hover:underline"
                >
                  email Anu
                </a>
                .
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function DocAvatar({ size = 40 }: { size?: number }) {
  return (
    <span
      className="relative inline-grid place-items-center rounded-full bg-white overflow-hidden border border-ocean/15 shadow-[0_4px_12px_-6px_rgba(50,50,255,0.35)] shrink-0"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/favicon.svg"
        alt=""
        width={size}
        height={size}
        className="object-contain"
        style={{ width: size * 0.7, height: size * 0.7 }}
      />
    </span>
  );
}

function SendIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}
