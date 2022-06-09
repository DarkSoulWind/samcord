const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'discord': {
          100: '#B9BBBE',
          150: '#50545C',
          200: '#5765F2',
          300: '#41444A',
          400: '#40444B',
          500: '#37393E',
          600: '#2F3136',
          700: '#292B2F',
          800: '#18191C',
        }
      },
    },
  },
  plugins: [
    require('tailwindcss-nested-groups'),
  ],
}