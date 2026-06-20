import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
        // Material You color tokens
        "secondary-fixed": "#c6e7ff",
        "on-primary": "#ffffff",
        "on-surface": "#191c1d",
        "on-secondary-container": "#004866",
        "on-background": "#191c1d",
        "on-surface-variant": "#464652",
        "on-secondary-fixed-variant": "#004c6b",
        "on-primary-container": "#9da1ff",
        "inverse-on-surface": "#f0f1f2",
        "on-tertiary-fixed-variant": "#6700b5",
        "on-primary-fixed-variant": "#373a9b",
        "secondary-container": "#2dbcfe",
        "on-tertiary": "#ffffff",
        "inverse-primary": "#c0c1ff",
        "surface-dim": "#d9dadb",
        "surface-container-highest": "#e1e3e4",
        "surface-container": "#edeeef",
        "tertiary-container": "#5c00a2",
        "on-secondary": "#ffffff",
        "surface-container-lowest": "#ffffff",
        background: "#f8f9fa",
        "tertiary-fixed": "#efdbff",
        outline: "#777683",
        "secondary-fixed-dim": "#82cfff",
        "on-error": "#ffffff",
        "surface-container-high": "#e7e8e9",
        "primary-container": "#2e3192",
        "outline-variant": "#c7c5d4",
        "inverse-surface": "#2e3132",
        "surface-variant": "#e1e3e4",
        "surface-tint": "#4f54b4",
        "tertiary-fixed-dim": "#dcb8ff",
        "error-container": "#ffdad6",
        "on-secondary-fixed": "#001e2d",
        "on-tertiary-fixed": "#2c0051",
        "on-primary-fixed": "#04006d",
        "primary-fixed": "#e1e0ff",
        "on-tertiary-container": "#c792ff",
        "on-error-container": "#93000a",
        "surface-container-low": "#f3f4f5",
        "primary-fixed-dim": "#c0c1ff",
        "surface-bright": "#f8f9fa",
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
