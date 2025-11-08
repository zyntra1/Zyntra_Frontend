/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          green: '#00A878',
          light: '#A7E8BD',
          dark: '#006B4F',
        },
        sky: {
          blue: '#A7E8BD',
          light: '#D4F4E0',
        },
        sunlight: {
          yellow: '#FFE156',
          glow: '#FFF7CC',
        },
        night: {
          blue: '#0B132B',
          deep: '#050A1A',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        'breathe': 'breathe 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255, 225, 86, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 225, 86, 0.8), 0 0 30px rgba(255, 225, 86, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
