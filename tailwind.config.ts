import type { Config } from "tailwindcss";

const config: Config = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dopa: {
          black: "#0C0F0A",
          surface: "#141911",
          card: "#191F15",
          border: "#2C3527",
          pink: "#FF206E",
          pinkdark: "#B80D48",
          yellow: "#FBFF12",
          cyan: "#41EAD4",
          white: "#FFFFFF",
        },
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
