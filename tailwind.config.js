/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'circular-web': ['circular-web', 'sans-serif'],
        'robert-medium': ['robert-mediumweb', 'sans-serif'],
        'robert-regular': ['robert-regular', 'sans-serif'],
        zentry: ['zentry', 'sans-serif'],
        general: ['general', 'sans-serif'],
      },
      colors: {
        blue: {
          50: "#DFDFF0",
          75: "#dfdff2",
          100: "#F0F2FA",
          200: "#010101",
          300: "#4FB7DD",
        },
        violet: {
          300: "#5724ff",
        },
        yellow: {
          100: "#8e983f",
          300: "#edff66",
        },
      },
      animation: {
        pulse: 'pulse 2s infinite',
        fade: 'fade 2s infinite',
      },
      keyframes: {
        pulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.01)' },
          '100%': { transform: 'scale(1)' },
        },
        fade: {
          '0%': { backgroundColor: '#252525' },
          '50%': { backgroundColor: '#000000' },
          '100%': { backgroundColor: '#353535' },
        },
      }
    },
  },
  plugins: [],
}