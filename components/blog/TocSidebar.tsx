"use client";

import { useEffect, useState } from "react";

export type TocItem = { id: string; text: string };

export default function TocSidebar({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-10% 0px -75% 0px", threshold: 0 },
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl p-5 bg-white border border-ink/10 shadow-[0_4px_24px_-4px_rgba(26,26,46,0.08)]">
      <p className="eyebrow mb-3 text-ocean">In This Guide</p>
      <nav className="flex flex-col space-y-0.5">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(item.id)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
                setActiveId(item.id);
              }}
              className={`block text-sm py-1.5 leading-snug transition-all duration-200 ${
                isActive
                  ? "text-ocean font-semibold pl-2"
                  : "text-muted hover:text-ocean hover:pl-2"
              }`}
            >
              {item.text}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
