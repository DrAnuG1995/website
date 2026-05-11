"use client";

import { useState } from "react";

export type FaqItem = { q: string; a: string };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="rounded-2xl overflow-hidden bg-white border border-ink/10 shadow-[0_4px_24px_-4px_rgba(26,26,46,0.08)] transition-shadow hover:shadow-[0_8px_40px_-8px_rgba(26,26,46,0.15)]"
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-ink/5"
              data-hover
            >
              <span className="text-sm font-medium pr-4 text-ink">
                {item.q}
              </span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
                className={`flex-shrink-0 transition-all duration-300 ${
                  isOpen ? "text-ocean rotate-180" : "text-muted"
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              style={{
                maxHeight: isOpen ? "600px" : "0",
                opacity: isOpen ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 0.15s ease, opacity 0.12s ease",
              }}
            >
              <div className="px-4 pb-4 pt-3 text-sm leading-relaxed text-muted border-t border-ink/10">
                {item.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
