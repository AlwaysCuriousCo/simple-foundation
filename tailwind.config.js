module.exports = {
  content: [
    './views/**/*.pug',
    './public/**/*.js'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: ['light', 'dark'], // Customize as needed
  },
}
