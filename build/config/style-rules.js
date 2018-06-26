// 参考但远优于 https://github.com/vuejs-templates/webpack/blob/master/template/build/utils.js
var extract = require('extract-text-webpack-plugin').extract
var ENV = require('./ENV')

// postcss-loader 配置见 .postcssrc
var basicLoaders = ['css-loader', 'postcss-loader']
var LOADERS = {
  css: basicLoaders,
  less: basicLoaders.concat('less-loader'),
  sass: basicLoaders.concat('sass-loader?indentedSyntax=true'),
  scss: basicLoaders.concat('sass-loader')
}

function ruleGen (ext, isForVueLoader) {
  var styleLoader = (isForVueLoader ? 'vue-' : '') + 'style-loader'
  var useLoaders = LOADERS[ext]

  return ENV.__DEV__
    ? [styleLoader].concat(useLoaders) // 开发环境下直接内嵌 CSS 以支持热替换
    : extract({ use: useLoaders, fallback: styleLoader }) // 生产环境下分离出 CSS 文件
}

function styleRulesGen (isForVueLoader) {
  var rules = isForVueLoader ? {} : []
  Object.keys(LOADERS).forEach(function (ext) {
    isForVueLoader
      ? rules[ext] = ruleGen(ext, true)
      : rules.push({ test: new RegExp('\\.' + ext + '$'), use: ruleGen(ext) })
  })
  return rules
}

exports.basic = styleRulesGen()
exports.vueLoader = styleRulesGen(true)
