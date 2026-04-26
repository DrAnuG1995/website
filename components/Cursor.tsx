"use client";
import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 900) {
      setCoarse(true);
      return;
    }

    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let dx = rx;
    let dy = ry;
    let raf = 0;

    const move = (e: MouseEvent) => {
      dx = e.clientX;
      dy = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${dx - 4}px, ${dy - 4}px, 0)`;
      }
    };

    const animate = () => {
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const checkHover = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      setHovering(!!t.closest("a, button, [data-hover]"));
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", checkHover);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", checkHover);
    };
  }, []);

  if (coarse) return null;

  return (
    <>
      <div
        ref={dot}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-ink z-[9999] pointer-events-none"
        style={{ mixBlendMode: "difference", transition: "opacity 0.2s" }}
      />
      <div
        ref={ring}
        className="fixed top-0 left-0 rounded-full border border-ink/40 z-[9998] pointer-events-none"
        style={{
          width: hovering ? 56 : 36,
          height: hovering ? 56 : 36,
          marginLeft: hovering ? -10 : 0,
          marginTop: hovering ? -10 : 0,
          transition:
            "width 0.32s cubic-bezier(.2,.8,.2,1), height 0.32s cubic-bezier(.2,.8,.2,1), margin 0.32s cubic-bezier(.2,.8,.2,1), background-color 0.3s",
          backgroundColor: hovering ? "rgba(205,227,93,0.2)" : "transparent",
          mixBlendMode: "difference",
        }}
      />
    </>
  );
}
