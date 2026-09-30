/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#2563EB',
        secondary: '#4F46E5',
        background: '#F8FAFC',
      }
    },
  },
  plugins: [],
}
