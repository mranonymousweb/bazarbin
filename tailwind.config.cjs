const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue'
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      slate: colors.slate,
      gray: {
        ...colors.gray,
        50: '#f7f6fc'
      },
      zinc: colors.zinc,
      neutral: {
        ...colors.neutral,
        150: '#efefef'
      },
      stone: colors.stone,
      red: {
        ...colors.red,
        450: '#FF928F',
        550: '#ff0555'
      },
      orange: colors.orange,
      amber: colors.amber,
      yellow: {
        ...colors.yellow,
        250: '#ffe69b'
      },
      lime: colors.lime,
      green: colors.green,
      emerald: colors.emerald,
      teal: colors.teal,
      cyan: {
        ...colors.cyan,
        250: '#67D1E0'
      },
      sky: colors.sky,
      blue: {
        ...colors.blue,
        450: '#737CFF',
        550: '#1290FF'
      },
      indigo: colors.indigo,
      violet: colors.violet,
      purple: colors.purple,
      fuchsia: colors.fuchsia,
      pink: colors.pink,
      rose: colors.rose,
      gold: '#fdd504'
    },
    fontFamily: {
      sans: ['iransansxv', 'tahoma', 'sans-serif']
    },
    extend: {
      maxWidth: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        '16': '4rem',
        '44': '11rem',
        '48': '12rem'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
