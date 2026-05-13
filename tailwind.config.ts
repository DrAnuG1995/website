import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Active palette
        bone: "#F5F1E8",
        ink: "#1a1a2e",
        electric: "#cde35d",     // chartreuse-lime — accents/highlights
        ocean: "#3232ff",        // brand blue — matches the StatDoctor app logo
        "ocean-soft": "#7b7bf4", // lighter ocean for halos and tints
        leaf: "#2f8f6e",         // muted medical green — for FAQ + map terrain
        muted: "#6b7a73",
        line: "#E2DCC8",
        // Lavender — used for the How-It-Works cards. Soft enough to read as
        // a tint of brand ocean, light enough to keep dark text legible.
        lavender: "#EFEDFF",
        "lavender-2": "#E5E1FF",
        // Legacy tokens — kept only for old pages still using them.
        "bone-2": "#EFE9DC",
        gauze: "#E8DFCB",
        parchment: "#D4C4A0",
        "ink-soft": "#2a2a4e",
        "electric-deep": "#b4ca44",
        "light-blue": "#7b7bf4",
        stat: "#FF5A36",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', '"Instrument Serif"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(.2,.8,.2,1)",
      },
      animation: {
        "marquee": "marquee 50s linear infinite",
        "marquee-slow": "marquee 70s linear infinite",
        "marquee-reverse": "marquee-reverse 60s linear infinite",
        "ping-slow": "ping 2.4s cubic-bezier(0,0,0.2,1) infinite",
        "drift-a": "drift-a 14s ease-in-out infinite",
        "drift-b": "drift-b 17s ease-in-out infinite",
        "drift-c": "drift-c 19s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
        "drift-a": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(18px, -22px)" },
        },
        "drift-b": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(-22px, 14px)" },
        },
        "drift-c": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(12px, 24px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
