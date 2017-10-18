const fs = require('fs')
const path = require('path')

const webpack = require('webpack')

const buildTheme = require('./build-theme')
const buildCss = require('./build-css')

function getDirectories (srcpath) {
  return fs.readdirSync(srcpath).filter(function (file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory()
  })
}

const themes = getDirectories(path.resolve('./style/theme'))

themes.forEach(function (theme) {
  webpack(buildTheme(theme)).run(function (err) {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    console.log('Built theme ' + theme + '.')
  })
})

;['base', 'index'].forEach(function (file) {
  webpack(buildCss(file)).run(function (err) {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    console.log('Built file ' + file + '.css')
  })
})
