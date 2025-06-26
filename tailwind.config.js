/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Yellow Theme
        yellow: {
          50: '#fffef7',
          100: '#fffbeb',
          200: '#fff4c7',
          300: '#ffec8b',
          400: '#ffdd4d',
          500: '#ffd700', // Main yellow
          600: '#e6c200',
          700: '#cc9900',
          800: '#b38600',
          900: '#996600',
        },
        // Royal Blue Theme
        royal: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6fe',
          300: '#a5b8fc',
          400: '#8292f8',
          500: '#4169e1', // Main royal blue
          600: '#3a5dd1',
          700: '#3251c1',
          800: '#2a45b1',
          900: '#1e3a8a',
        },
        // Keep gold for special elements
        gold: {
          50: '#fffdf7',
          100: '#fffaeb',
          200: '#fff2c7',
          300: '#ffe69c',
          400: '#ffd666',
          500: '#ffc53d',
          600: '#f59e0b',
          700: '#d97706',
          800: '#b45309',
          900: '#92400e',
        },
        // Navy for dark elements
        navy: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6fe',
          300: '#a5b8fc',
          400: '#8292f8',
          500: '#636df2',
          600: '#4c50e8',
          700: '#3d3ed4',
          800: '#3333ab',
          900: '#1e1b4b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}