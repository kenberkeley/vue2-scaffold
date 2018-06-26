var path = require('path')

/**
 * 便捷求取路径原型函数
 * @param  {String} target
 * @return {String} path to target
 */
String.prototype.join = function (target) { // eslint-disable-line no-extend-native
  return path.join(this.toString(), target)
}

var ROOT = path.resolve(__dirname, '../..')

module.exports = {
  DIST: ROOT.join('dist'),    // build 后输出目录
  MOCK: ROOT.join('mock'),    // mock 服务器
  SRC: ROOT.join('src'),      // 源码目录
  STATIC: ROOT.join('static') // 高度静态资源目录
}
