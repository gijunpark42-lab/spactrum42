import type { Config } from "tailwindcss";

/**
 * Design language: Bloomberg-terminal-meets-modern-fintech.
 * Deep neutral background, a single cool teal accent for interactive elements,
 * and green/red reserved strictly for directional meaning.
 */
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // surfaces
        bg: "#0A0E14",
        surface: "#111823",
        "surface-2": "#0E141D",
        elevated: "#161F2B",
        border: "#212B38",
        "border-strong": "#2C3947",
        // text
        ink: "#E6EDF3",
        muted: "#8A98AB",
        faint: "#5C6B7E",
        // single cool accent (teal/cyan) for interactive elements
        accent: "#37B7C3",
        "accent-soft": "#1C3A42",
        // directional-only colors
        positive: "#3DD68C",
        "positive-soft": "#123528",
        negative: "#F1707B",
        "negative-soft": "#3A1A20",
        // estimate/provenance
        estimate: "#E5B95C",
        "estimate-soft": "#3A3016",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "SF Mono",
          "JetBrains Mono",
          "Cascadia Code",
          "Consolas",
          "Menlo",
          "monospace",
        ],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(255,255,255,0.02) inset, 0 0 0 1px rgba(0,0,0,0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
