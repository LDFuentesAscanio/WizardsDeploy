import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'], // Asegurate de incluir tus rutas
  theme: {
    extend: {
      colors: {
        primary: '#2c3d5a',
        secondary: '#67ff94',
        tertiary1: '#8effd2',
        tertiary2: '#e7e7e7',
      },
      fontFamily: {
        mifuente: ['grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
