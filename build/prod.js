var fs = require('fs-extra')
var webpack = require('webpack')
var PATHS = require('./config/PATHS')
var config = require('./webpack.prod.conf')

fs.emptyDirSync(PATHS.DIST) // 清空 build 目录
fs.copySync(PATHS.STATIC, PATHS.DIST.join('static')) // 复制高度静态资源

webpack(config, function (err, stats) {
  if (err) throw err
  // show build info to console
  console.log(stats.toString({ chunks: false, color: true }))
})
