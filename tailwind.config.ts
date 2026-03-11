import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Certificate design colors - traditional document aesthetic
        certificate: {
          cream: '#FFF8E7',
          'off-white': '#FAF7F0',
          'dark-text': '#1a1a1a',
          'deep-blue': '#1e3a5f',
          burgundy: '#6b2737',
          'forest-green': '#2d5016',
          gold: '#d4af37',
          bronze: '#cd7f32',
        },
      },
      fontFamily: {
        // Serif fonts for official document feel
        serif: ['Georgia', 'Crimson Text', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
