// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        },
      },
      boxShadow: {
        glass: '0 12px 32px rgba(15, 23, 42, 0.10)',
      },
      backgroundImage: {
        mesh: 'radial-gradient(circle at top left, rgba(20,184,166,.18), transparent 30%), radial-gradient(circle at bottom right, rgba(59,130,246,.18), transparent 28%)',
      },
    },
  },
  plugins: [],
}