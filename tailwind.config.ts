import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px', // Extra small devices - between mobile and sm
      },
      colors: {
        'primary-dark': '#1C1C1C',
        'light-contrast': '#FFFFFF',
        'primary-accent': '#D4AF37',
        'secondary-accent': '#B06579',
        neutral: '#5A5A5A',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        allura: ['var(--font-allura)', 'cursive'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
