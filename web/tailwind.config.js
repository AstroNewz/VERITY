/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFFBEF",
        ink: "#111111",
        yellow: {
          DEFAULT: "#FFD93D",
          hover: "#F5CE2D",
          light: "#FFF4B8",
        },
        pink: {
          DEFAULT: "#FF9EDB",
          light: "#FFE3F4",
        },
        mint: {
          DEFAULT: "#6EE7B7",
          dark: "#34D399",
          light: "#D1FAE5",
        },
        periwinkle: {
          DEFAULT: "#9DB0FF",
          light: "#DEE5FF",
        },
        danger: {
          DEFAULT: "#E5484D",
          light: "#FFE5E5",
        }
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0 #111111',
        'brutal-btn': '4px 4px 0 #111111',
        'brutal-card': '6px 6px 0 #111111',
        'brutal-lg': '8px 8px 0 #111111',
        'brutal-xl': '12px 12px 0 #111111',
      },
      borderWidth: {
        '3': '3px',
      },
      fontFamily: {
        heading: ['var(--font-fraunces)', 'serif'],
        body: ['var(--font-space-grotesk)', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      }
    },
  },
  plugins: [],
};
