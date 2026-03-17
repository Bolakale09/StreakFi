import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#10243E",
        cloud: "#F6F2EA",
        blush: "#FFD7B8",
        mint: "#B5F0DB",
        coral: "#FF7C5B",
        sand: "#FFF8EF",
        sky: "#D8EEFF",
      },
      boxShadow: {
        soft: "0 16px 40px rgba(16, 36, 62, 0.12)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top, rgba(255, 124, 91, 0.22), transparent 42%)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
