import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFEB3B', // Яркий желтый Kill Bill
          dark: '#F9A825',
          light: '#FFF59D',
        },
        secondary: {
          DEFAULT: '#FF0000', // Агрессивный красный
          dark: '#C62828',
          light: '#FF5252',
        },
        dark: {
          DEFAULT: '#000000',
          light: '#1A1A1A',
          lighter: '#2D2D2D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;