const { theme } = require('@gac/core-components/lib/tailwind.theme')

module.exports = {
  content: [
    './public/**/*.html',
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@gac/core-components/lib/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    ...theme
  },
  plugins: [require('@tailwindcss/line-clamp'), require('tailwind-scrollbar')]
}
