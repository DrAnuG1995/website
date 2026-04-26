import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Active palette
        bone: "#F5F1E8",
        ink: "#1a1a2e",
        electric: "#cde35d",
        muted: "#6b7a73",
        line: "#E2DCC8",
        // Legacy tokens — referenced by hospitals/partners/blog/contact pages.
        // Cleanup of those pages is pending; do not use in new code.
        "bone-2": "#EFE9DC",
        gauze: "#E8DFCB",
        parchment: "#D4C4A0",
        "ink-soft": "#2a2a4e",
        "electric-deep": "#b4ca44",
        ocean: "#3232ff",
        "light-blue": "#7b7bf4",
        stat: "#FF5A36",
      },
      fontFamily: {
        display: ['"Instrument Serif"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"Inter"', "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(.2,.8,.2,1)",
      },
      animation: {
        "marquee": "marquee 50s linear infinite",
        "marquee-slow": "marquee 70s linear infinite",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
