import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        prim: '#2c3d5a',
        secon: '#67ff94',
        tert1: '#8effd2',
        tert2: '#e7e7e7',
        background: '#2c3d5a',
        foreground: '#ededed',
      },
      fontFamily: {
        sans: ['var(--font-mulish)', 'sans-serif'], // <- para `font-sans`
        display: ['var(--font-rubik)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
