import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bone: "#F5F1E8",
        "bone-2": "#EFE9DC",
        gauze: "#E8DFCB",
        parchment: "#D4C4A0",
        ink: "#1a1a2e",
        "ink-soft": "#2a2a4e",
        electric: "#cde35d",
        "electric-deep": "#b4ca44",
        ocean: "#3232ff",
        "light-blue": "#7b7bf4",
        stat: "#FF5A36",
        muted: "#6b7a73",
      },
      fontFamily: {
        display: ['"Instrument Serif"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(.2,.8,.2,1)",
        spring: "cubic-bezier(.34,1.56,.64,1)",
      },
      animation: {
        "pulse-dot": "pulseDot 1.6s ease-in-out infinite",
        "marquee": "marquee 40s linear infinite",
        "marquee-slow": "marquee 60s linear infinite",
        "blink": "blink 1.1s step-end infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        pulseDot: {
          "0%,100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.4)", opacity: "0.5" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        blink: { "50%": { opacity: "0" } },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
