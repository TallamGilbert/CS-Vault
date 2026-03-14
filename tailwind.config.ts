import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dv: {
          bg:         "rgb(var(--dv-bg) / <alpha-value>)",
          surface:    "rgb(var(--dv-surface) / <alpha-value>)",
          elevated:   "rgb(var(--dv-elevated) / <alpha-value>)",
          raised:     "rgb(var(--dv-raised) / <alpha-value>)",
          accent:     "rgb(var(--dv-accent) / <alpha-value>)",
          accentHover:"rgb(var(--dv-accentHover) / <alpha-value>)",
          accentDim:  "rgb(var(--dv-accentDim) / <alpha-value>)",
          text:       "rgb(var(--dv-text) / <alpha-value>)",
          text2:      "rgb(var(--dv-text2) / <alpha-value>)",
          text3:      "rgb(var(--dv-text3) / <alpha-value>)",
          border:     "rgb(var(--dv-border) / <alpha-value>)",
          border2:    "rgb(var(--dv-border2) / <alpha-value>)",
        },
      },
      fontFamily: {
        heading: ['"General Sans"', "sans-serif"],
        body:    ['"IBM Plex Sans"', "sans-serif"],
        mono:    ['"IBM Plex Mono"', "monospace"],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        pulse: {
          "0%, 100%": { opacity: "0.4" },
          "50%":      { opacity: "1" },
        },
      },
      animation: {
        "fade-up":  "fadeUp 0.45s ease-out both",
        "fade-in":  "fadeIn 0.35s ease-out both",
        "pulse-slow": "pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
