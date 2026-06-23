/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0A0A0A',
          surface: '#1A1A1A',
        },
        primary: {
          gold: '#C9A84C',
          lightGold: '#E2C07A',
        },
        text: {
          primary: '#F5F5F5',
          secondary: '#9A9A9A',
        },
        border: {
          DEFAULT: '#2E2E2E',
        },
        status: {
          success: '#4CAF7D',
          error: '#EF4444',
        }
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter: ['Inter', 'sans-serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
      },
    },
  },
  plugins: [],
}
