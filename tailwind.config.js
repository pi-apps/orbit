/** @type {import('tailwindcss').Config} */
module.exports = {
content: [
    './src/**/*.{js,jsx,ts,tsx,html}',
  ], theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

