// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    "postcss-px-to-viewport": {
      unitToConvert: 'px',
      viewportWidth: 1520,
      unitPrecision: 3,
      viewportUnit: 'vw',
      selectorBlackList: [],
      minPixelValue: 1,
      mediaQuery: false
    },
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {}
  }
}
