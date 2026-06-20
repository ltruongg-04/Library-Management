import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e1e0ff",
          100: "#c0c1ff",
          500: "#2e3192",
          700: "#15157d",
          900: "#04006d",
        },
        secondary: {
          50: "#c6e7ff",
          300: "#2dbcfe",
          500: "#00658d",
        },
        tertiary: {
          300: "#c792ff",
          500: "#3e0070",
        },
        error: {
          50: "#ffdad6",
          500: "#ba1a1a",
          700: "#93000a",
        },
        surface: {
          lowest: "#ffffff",
          default: "#f8f9fa",
          high: "#e7e8e9",
        },
        content: {
          primary: "#191c1d",
          secondary: "#464652",
          outline: "#777683",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
      },
      borderRadius: {
        card: "8px",
        button: "8px",
      },
      boxShadow: {
        "level-1": "0 4px 12px rgba(0, 0, 0, 0.05)",
        "level-2": "0 12px 32px rgba(0, 0, 0, 0.1)",
        "ai-glow": "0 0 16px rgba(0, 101, 141, 0.2)",
      },
      animation: {
        "fade-in": "fadeIn 200ms ease-out",
        "slide-up": "slideUp 300ms ease-out",
        "slide-in-right": "slideInRight 300ms ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;