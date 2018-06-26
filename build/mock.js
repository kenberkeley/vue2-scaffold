var express = require('express')
var chokidar = require('chokidar')
var debounce = require('debounce')
var clearModule = require('clear-module')
var CLIEngine = require('eslint').CLIEngine
var cliFormatter = require('eslint-friendly-formatter')
var htmlFormatter = require('eslint/lib/formatters/html')

var pathToMockServerDir = require('./config/PATHS').MOCK
var pathToMockServerApp = pathToMockServerDir.join('app.js')
var matchMockServerFiles = new RegExp(
  pathToMockServerDir.replace(/\\/g, '\\\\') // for Windows compatible
)

/**
 * Babel setup
 */
require('babel-register')({
  cache: true,
  only: pathToMockServerDir,
  presets: [
    ['env', { targets: { node: 'current' } }]
  ]
})

/**
 * ESLint setup
 */
var cli = new CLIEngine({
  cache: true,
  cwd: pathToMockServerDir
  // configFile: <using ROOT/.eslintrc>
})
function lintMockServerFiles () {
  var report = cli.executeOnFiles([pathToMockServerDir])
  return (report.errorCount || report.warningCount) ? report.results : null
}
function createLintFailureServer (errInfo) {
  var server = express()
  server.use(function (req, res) {
    res.status(500).send(htmlFormatter(errInfo))
  })
  return server
}

// mock server auto reload
// (thanks to https://github.com/expressjs/express/issues/2596#issuecomment-81353034)
var mockServer

var watcher = chokidar.watch(pathToMockServerDir)

var reloadMockServer = debounce(function () {
  var errInfo = lintMockServerFiles()
  if (errInfo) {
    mockServer = createLintFailureServer(errInfo)
    console.error(cliFormatter(errInfo))
    return
  }
  clearModule.match(matchMockServerFiles)
  mockServer = require(pathToMockServerApp).default
  console.info('Mock server fresh loaded')
}, 1000, true)

'add addDir change unlink unlinkDir'.split(' ').forEach(function (event) {
  watcher.on(event, reloadMockServer)
})

module.exports = function (devServer) {
  devServer.use(function (req, res, next) {
    mockServer(req, res, next)
  })
}
