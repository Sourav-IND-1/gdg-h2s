/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crisis: {
          red: '#DC2626',
          'red-dark': '#991B1B',
          'red-light': '#FEE2E2',
          amber: '#D97706',
          'amber-light': '#FEF3C7',
          green: '#16A34A',
          'green-light': '#DCFCE7',
        }
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
