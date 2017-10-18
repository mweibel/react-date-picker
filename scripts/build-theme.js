'use strict'

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const extractRules = require('./extractRules')

module.exports = function (themeName) {
  const entry = {
    index: './style/theme/' + themeName + '/index.scss'
  }

  return {
    bail: true,
    entry: entry,
    output: {
      path: path.resolve('./theme/'),
      filename: themeName + '.css'
    },
    module: {
      rules: extractRules
    },
    plugins: [
      new ExtractTextPlugin(themeName + '.css')
    ]
  }
}
