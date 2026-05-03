/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './lessons/*.html'],
  theme: {
    extend: {
      colors: {
        navy: '#1B2A4A',
        terracotta: '#E07A5F',
        'terracotta-dark': '#c9664b',
        gold: '#F2CC8F',
        'off-white': '#FAFAFA',
        'warm-gray': '#F0EDE8',
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        heading: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};
