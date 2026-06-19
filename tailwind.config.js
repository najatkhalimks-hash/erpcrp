/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}','./components/**/*.{js,jsx}'],
  theme: { extend: {
    colors: {
      ink:    '#0D1B2A',
      navy:   '#1F3864',
      teal:   '#005757',
      violet: '#4B0082',
      amber:  '#7F4F00',
      forest: '#1E4D2B',
      gold:   '#BF9000',
      slate:  '#F5F5F5',
    },
    fontFamily: { mono: ['"JetBrains Mono"','monospace'] }
  }},
  plugins: [],
}
