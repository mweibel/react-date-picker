'use strict'

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const fileExists = require('file-exists')

const extractRules = require('./extractRules')

/**
 * @param  {String} file File name - should be located in the ./style folder and have a scss extension
 *
 * @return {Object} webpack configuration
 */
module.exports = function (file) {
  const filePath = './style/' + file + '.scss'

  const entry = {
    index: fileExists(filePath) ? filePath : file
  }

  return {
    bail: true,
    entry: entry,
    output: {
      path: path.resolve('./'),
      filename: file + '.css'
    },
    module: {
      rules: extractRules
    },
    plugins: [
      new ExtractTextPlugin(file + '.css')
    ]
  }
}
