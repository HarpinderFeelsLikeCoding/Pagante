/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
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
      },
    },
  },
  plugins: [],
}