/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          50: '#F0F6FC',
          100: '#E1EDFB',
          150: '#D6E4F5',
          200: '#C5DCF4',
          300: '#A9C6E8',
          400: '#8EB2DC',
          500: '#6995C9',
          600: '#4A75AB',
          700: '#345582',
          800: '#223959',
          900: '#0E2440',
        },
        navy: {
          DEFAULT: '#0E2440',
          light: '#1B3B6F',
          dark: '#071629'
        },
        coral: {
          DEFAULT: '#E66E3A',
          hover: '#CF5C2B',
          light: '#FFF2EB'
        },
        leaf: {
          DEFAULT: '#16A34A',
          hover: '#15803D',
          light: '#ECFDF5'
        }
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(169, 198, 232, 0.25)',
        'glass': '0 8px 32px 0 rgba(14, 36, 64, 0.08)',
        'card': '0 4px 20px -2px rgba(14, 36, 64, 0.05)',
        'float': '0 20px 40px -10px rgba(14, 36, 64, 0.12)'
      }
    },
  },
  plugins: [],
}
