var webpack = require('webpack')
var config = require('./webpack.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

config.output.filename = 'js/[name].[chunkhash:6].js'
config.output.chunkFilename = 'js/[id].[chunkhash:6].js'

config.plugins.push(
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    beautify: false,
    comments: false,
    compress: {
      warnings: false,
      collapse_vars: true,
      reduce_vars: true
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    minChunks: Infinity
  }),
  new webpack.optimize.AggressiveMergingPlugin(),
  new webpack.optimize.MinChunkSizePlugin({
    minChunkSize: 30000
  }),
  new ExtractTextPlugin({
    filename: 'css/[name].[contenthash:6].css',
    allChunks: true // 若要按需加载 CSS 则请注释掉该行
  }),
  new OptimizeCssAssetsPlugin({
    cssProcessorOptions: {
      safe: true
    }
  })
  // ,new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)()
)

module.exports = config
