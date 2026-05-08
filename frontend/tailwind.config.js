/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EFF6FF',
          400: '#4D8BFF',
          500: '#1460FA',
          600: '#1152D4',
          900: '#1E3A8A',
        },
        slate: {
          50: '#F8FAFC',
          200: '#E2E8F0',
          400: '#94A3B8',
          500: '#64748B',
          700: '#334155',
          950: '#0F172A',
        },
        gray: {
          50: '#F7F7F7',
          100: '#EDEDED',
          200: '#DEDEDE',
          300: '#CCCCCC',
          400: '#B2B2B2',
          500: '#9C9C9C',
          600: '#717171',
          700: '#595959',
          800: '#404040',
          900: '#2E2E2E',
          950: '#111111',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        title: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}