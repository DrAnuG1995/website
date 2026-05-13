"use client";

import type { TocItem } from "./TocSidebar";

export default function MobileToc({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="block lg:hidden mb-6">
      <div className="rounded-2xl p-5 bg-white border border-ink/10 shadow-[0_4px_24px_-4px_rgba(26,26,46,0.08)]">
        <p className="eyebrow mb-3 text-ocean">In This Guide</p>
        <nav className="flex flex-col space-y-0.5">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(item.id)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="block text-sm py-1.5 leading-snug text-muted"
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
