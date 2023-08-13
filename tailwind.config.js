/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        vazir: ['vazirmatn'],
        vazirFD: ['Vazirmatn FD']
      },
      colors: {
        primary: 'rgb(31, 116, 255)',
        success: 'rgb(23, 201, 100)',
        danger: 'rgb(242, 19, 93)',
        warning: 'rgb(255, 130, 0)',
        dark: 'rgb(36, 33, 69)'
      }
    },
  },
  plugins: [],
}

