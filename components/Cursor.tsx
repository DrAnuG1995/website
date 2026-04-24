"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const x = useSpring(mouseX, { stiffness: 500, damping: 40 });
  const y = useSpring(mouseY, { stiffness: 500, damping: 40 });
  const [hover, setHover] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setHide(true);
      return;
    }
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, [data-hover]")) setHover(true);
      else setHover(false);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [mouseX, mouseY]);

  if (hide) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full mix-blend-multiply"
      style={{
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
        width: hover ? 44 : 12,
        height: hover ? 44 : 12,
        background: hover ? "#cde35d" : "#1a1a2e",
        transition: "width .25s cubic-bezier(.2,.8,.2,1), height .25s cubic-bezier(.2,.8,.2,1), background .25s",
      }}
    />
  );
}
