"use client";
import { useEffect, useRef } from "react";

export default function SplitText({
  children,
  className = "",
  as: Tag = "span",
  stagger = 0.025,
  start = 0,
}: {
  children: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  stagger?: number;
  start?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll<HTMLElement>(".char");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            chars.forEach((c, i) => {
              setTimeout(() => c.classList.add("in"), start * 1000 + i * stagger * 1000);
            });
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [stagger, start]);

  const words = children.split(" ");
  return (
    // @ts-ignore
    <Tag ref={ref} className={className}>
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap mr-[0.25em]">
          {Array.from(w).map((c, ci) => (
            <span key={ci} className="char">
              {c}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
