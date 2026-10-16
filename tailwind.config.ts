import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F2C667",
          dark: "#B8960C",
        },
        charcoal: "#1A1A1A",
        jet: "#0D0D0D",
        ivory: "#F7F5EF",
      },
      fontFamily: {
        // Variables are set by next/font in src/app/layout.tsx
        cinzel: ["var(--font-cinzel)", "serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
