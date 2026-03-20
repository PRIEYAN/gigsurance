import type { Config } from "tailwindcss";

// In Tailwind v4, theme tokens are defined in globals.css via @theme{}
// This file only needs to exist for potential plugins
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;
