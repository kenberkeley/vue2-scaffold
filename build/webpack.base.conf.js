var webpack = require('webpack')
var ENV = require('./config/ENV')
var PATHS = require('./config/PATHS')
var styleRules = require('./config/style-rules')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var NyanProgressPlugin = require('nyan-progress-webpack-plugin')

module.exports = {
  entry: {
    app: PATHS.SRC.join('app.js')
  },
  // devtool - source map related (see https://webpack.js.org/configuration/devtool)
  devtool: false,
  output: {
    path: PATHS.DIST,
    publicPath: ''
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': PATHS.SRC
    }
  },
  module: {
    rules: [{
      test: /\.(js|vue)$/,
      loader: 'eslint-loader',
      options: {
        formatter: require('eslint-friendly-formatter')
      },
      enforce: 'pre',
      include: PATHS.SRC
    }, {
      test: /\.js$/,
      loader: 'babel-loader?cacheDirectory',
      include: PATHS.SRC
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: styleRules.vueLoader
      }
    }, {
      test: /\.(png|jpe?g|gif|svg)$/,
      loader: 'url-loader',
      options: {
        limit: 10240, // 10KB 以下使用 base64
        name: 'img/[name]-[hash:6].[ext]'
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)$/,
      loader: 'url-loader',
      options: {
        limit: 10240,
        name: 'fonts/[name]-[hash:6].[ext]'
      }
    }].concat(styleRules.basic)
  },
  plugins: [
    new NyanProgressPlugin(),
    new webpack.DefinePlugin(ENV),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        return module.context && module.context.indexOf('node_modules') !== -1
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: PATHS.SRC.join('index.html')
    })
  ]
}
