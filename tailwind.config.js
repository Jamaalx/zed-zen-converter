module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        'zedzen-purple': '#8B5CFF',
        'zedzen-green': '#9eff33',
        'zedzen-yellow': '#FFC837',
        'zedzen-black': '#141414',
        'zedzen-gray': '#EBEBEB',
      },
      fontFamily: {
        'sans': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}