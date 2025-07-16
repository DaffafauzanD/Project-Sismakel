/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: ['selector', '[data-bs-theme="dark"]'], // Mendeteksi dark mode dari attribute data-bs-theme
  theme: {
    extend: {
      // Sinkronisasi dengan theme colors dari SCSS existing
      colors: {
        primary: {
          50: 'rgb(var(--bs-primary-rgb) / 0.1)',
          100: 'rgb(var(--bs-primary-rgb) / 0.2)', 
          200: 'rgb(var(--bs-primary-rgb) / 0.3)',
          300: 'rgb(var(--bs-primary-rgb) / 0.4)',
          400: 'rgb(var(--bs-primary-rgb) / 0.6)',
          500: 'rgb(var(--bs-primary-rgb))',
          600: 'rgb(var(--bs-primary-rgb) / 0.9)',
          700: 'rgb(var(--bs-primary-rgb) / 0.8)',
          800: 'rgb(var(--bs-primary-rgb) / 0.7)',
          900: 'rgb(var(--bs-primary-rgb) / 0.6)',
          950: 'rgb(var(--bs-primary-rgb) / 0.5)',
        }
      }
    },
  },
  plugins: [],
  // Disable preflight untuk menghindari konflik dengan Bootstrap reset
  corePlugins: {
    preflight: false,
  },
}
