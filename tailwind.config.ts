import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "475px", // Extra small devices - between mobile and sm
      },
      colors: {
        "accent-primary": "var(--color-accent-primary)",
        "accent-secondary": "var(--color-accent-secondary)",
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "surface-2": "var(--color-surface-2)",
        heading: "var(--color-heading)",
        main: "var(--color-body)",
        muted: "var(--color-muted)",
        "primary-accent": "var(--color-accent-primary)",
        "secondary-accent": "var(--color-accent-secondary)",
        "tertiary-accent": "var(--color-accent-tertiary)",
        card: "var(--color-card)",
        selected: "var(--color-selected)",
        neutral: "var(--color-neutral)",
        whatsapp: "var(--color-whatsapp)",
      },
      fontFamily: {
        sans: [
          "var(--font-montserrat)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
        ],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        montserrat: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
