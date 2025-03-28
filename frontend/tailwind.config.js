import daisyui from 'daisyui'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-slide-in': {
          '0%': { opacity: 0, transform: 'translateX(30px) scale(0.98)', filter: 'blur(4px)' },
          '100%': { opacity: 1, transform: 'translateX(0) scale(1)', filter: 'blur(0)' },
        },
      },
      animation: {
        'fade-slide-in': 'fade-slide-in 0.4s ease-out forwards',
      },
    },
  },
  plugins: [daisyui],
}