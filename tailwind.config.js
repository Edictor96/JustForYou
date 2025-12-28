/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Romantic pastel palette inspired by trishaverma__ Instagram aesthetic
        'romantic-pink': {
          50: '#fff0f6',
          100: '#ffe4f0',
          200: '#ffd6e7',
          300: '#ffb8d9',
          400: '#ff8fab',
          500: '#ff6b9d',
          600: '#f73f7f',
          700: '#e01e68',
        },
        'romantic-purple': {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c8b6ff',
          400: '#b794ff',
          500: '#a673ff',
          600: '#9656f6',
          700: '#7c3aed',
        },
        'romantic-lavender': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
        },
      },
      fontFamily: {
        'romantic': ['Poppins', 'Inter', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'romantic': '0 4px 20px rgba(255, 107, 157, 0.15)',
        'romantic-lg': '0 8px 32px rgba(255, 107, 157, 0.2)',
        'romantic-purple': '0 4px 20px rgba(200, 182, 255, 0.15)',
        'romantic-glow': '0 0 30px rgba(255, 182, 217, 0.3)',
      },
      backdropBlur: {
        'romantic': '12px',
      },
    },
  },
  plugins: [],
}
