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
        background: '#fbf9f8',
        surface: '#fbf9f8',
        'surface-dim': '#dbdad9',
        'on-surface': '#1b1c1c',
        primary: '#00261e',
        'primary-container': '#173c33',
        secondary: '#825500',
        'secondary-container': '#fdba55',
        outline: '#717975',
        'outline-variant': '#c1c8c4',
      },
      fontFamily: {
        headline: ['"Source Serif 4"', 'serif'],
        body: ['"Hanken Grotesk"', 'sans-serif'],
      },
      borderRadius: {
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
};
export default config;
