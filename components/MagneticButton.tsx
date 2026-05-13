"use client";
import { useRef, useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  external = false,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "electric";
  className?: string;
  external?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [xy, setXY] = useState({ x: 0, y: 0 });

  const onMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setXY({ x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.25 });
  };
  const reset = () => setXY({ x: 0, y: 0 });

  const classes = clsx(
    "inline-flex items-center gap-2.5 rounded-full font-medium text-sm px-6 py-3.5 transition-colors duration-300 relative overflow-hidden",
    variant === "primary" && "bg-ink text-bone hover:bg-ocean",
    variant === "ghost" && "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-bone",
    variant === "electric" && "bg-electric text-ink hover:bg-ink hover:text-electric",
    className
  );

  const inner = (
    <motion.span
      animate={{ x: xy.x * 0.5, y: xy.y * 0.5 }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className="inline-flex items-center gap-2.5"
    >
      {children}
    </motion.span>
  );

  const Wrap = href ? "a" : "button";
  const props: any = href
    ? { href, ...(external ? { target: "_blank", rel: "noopener" } : {}) }
    : { onClick };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      animate={{ x: xy.x, y: xy.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className="inline-block"
      data-hover
    >
      <Wrap {...props} className={classes}>
        {inner}
      </Wrap>
    </motion.div>
  );
}
