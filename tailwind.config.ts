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
        'primary-dark': '#0A0A0A',        // Negro más profundo
        'secondary-dark': '#1A1A1A',      // Gris oscuro para variedad
        'light-contrast': '#FFFFFF',      // Blanco puro mantener
        'primary-accent': '#6366F1',      // Indigo moderno (más tech/profesional)
        'secondary-accent': '#10B981',    // Verde esmeralda (sofisticado)
        'tertiary-accent': '#F59E0B',     // Ámbar cálido (para acentos especiales)
        neutral: '#6B7280',               // Gris más suave
        'neutral-light': '#9CA3AF',       // Gris claro para texto secundario
        'glass-white': 'rgba(255, 255, 255, 0.1)', // Para efectos glassmorphism
        'glass-dark': 'rgba(0, 0, 0, 0.2)',        // Para overlays
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
