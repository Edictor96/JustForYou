/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        // Darker romantic purple/violet palette with medium red violet tones
        'romantic-pink': {
          50: '#f3e5f0',
          100: '#e6cce1',
          200: '#d9b3d2',
          300: '#cc99c3',
          400: '#bf80b4',
          500: '#b266a5',
          600: '#a54d96',
          700: '#8a3d7a',
        },
        'romantic-purple': {
          50: '#e8dff5',
          100: '#d1bfeb',
          200: '#ba9fe1',
          300: '#a380d7',
          400: '#8c60cd',
          500: '#7540c3',
          600: '#5e20b9',
          700: '#4d1a99',
        },
        'romantic-lavender': {
          50: '#ede5f5',
          100: '#dbcceb',
          200: '#c9b3e1',
          300: '#b799d7',
          400: '#a580cd',
          500: '#9366c3',
          600: '#814db9',
          700: '#6f3d9e',
        },
        'romantic-violet': {
          50: '#f0e5f5',
          100: '#e1cceb',
          200: '#d2b3e1',
          300: '#c399d7',
          400: '#b480cd',
          500: '#a566c3',
          600: '#964db9',
          700: '#7d3d9e',
        },
      },
      fontFamily: {
        'romantic': ['Poppins', 'Inter', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'romantic': '0 4px 20px rgba(165, 77, 150, 0.2)',
        'romantic-lg': '0 8px 32px rgba(165, 77, 150, 0.25)',
        'romantic-purple': '0 4px 20px rgba(140, 96, 205, 0.2)',
        'romantic-glow': '0 0 30px rgba(165, 77, 150, 0.35)',
      },
      backdropBlur: {
        'romantic': '12px',
      },
    },
  },
  plugins: [],
}
