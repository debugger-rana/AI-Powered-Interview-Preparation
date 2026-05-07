/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#ff2d78',
        'brand-dark': '#e11d68',
      },
    },
  },
  plugins: [],
}
