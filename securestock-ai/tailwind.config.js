/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        obsidian: {
          950: "#03050A",
          900: "#060C14",
          800: "#0A1428",
          700: "#0F1E3D",
          600: "#162547",
        },
        cyan: {
          neon: "#00FFD1",
          bright: "#00E5B8",
          mid: "#00C9A0",
          dim: "#008C6F",
          glow: "rgba(0,255,209,0.15)",
        },
        gold: {
          bright: "#FFD166",
          mid: "#F0B429",
          dim: "#B8860B",
        },
        success: "#00FF94",
        danger: "#FF4560",
        warning: "#FFB020",
      },
      backgroundImage: {
        "mesh-dark":
          "radial-gradient(at 40% 20%, #0F1E3D 0px, transparent 50%), radial-gradient(at 80% 0%, #003D2E 0px, transparent 50%), radial-gradient(at 0% 50%, #060C14 0px, transparent 50%)",
        "glass-card":
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
      },
      boxShadow: {
        glass: "0 4px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        cyan: "0 0 20px rgba(0,255,209,0.3), 0 0 60px rgba(0,255,209,0.1)",
        "cyan-sm": "0 0 10px rgba(0,255,209,0.2)",
        gold: "0 0 20px rgba(255,209,102,0.3)",
        card: "0 8px 32px rgba(0,0,0,0.5)",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "slide-up": "slide-up 0.4s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(0,255,209,0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(0,255,209,0.6), 0 0 40px rgba(0,255,209,0.2)" },
        },
        "slide-up": {
          from: { opacity: 0, transform: "translateY(16px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
