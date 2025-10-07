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
        'background': 'var(--color-background)',
        'surface': 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        'heading': 'var(--color-heading)',
        'main': 'var(--color-body)',
        'muted': 'var(--color-muted)',
        'primary-accent': 'var(--color-accent-primary)',
        'secondary-accent': 'var(--color-accent-secondary)',
        'tertiary-accent': 'var(--color-accent-tertiary)',
        'neutral': 'var(--color-neutral)',
        'whatsapp': 'var(--color-whatsapp)',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        allura: ['var(--font-allura)', 'cursive'],
        inter: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
} satisfies Config;
