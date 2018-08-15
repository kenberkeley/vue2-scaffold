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
  pathToMockServerDir.replace(/\\/g, '\\\\') // for Windows compatibility
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

function freshLoadMockServer () {
  var errInfo = lintMockServerFiles()
  if (errInfo) {
    mockServer = createLintFailureServer(errInfo)
    console.error(cliFormatter(errInfo))
    return
  }
  clearModule.match(matchMockServerFiles)
  mockServer = require(pathToMockServerApp).default
  console.info('Mock server fresh loaded')
}
freshLoadMockServer()

var fileWatcher = chokidar.watch(pathToMockServerDir, {
  ignored: [
    pathToMockServerDir.join('upload'),
    pathToMockServerDir.join('.eslintcache')
  ]
}).on('ready', function () {
  fileWatcher.on('all', debounce(freshLoadMockServer, 500))
})

/**
 * Integrate with dev server
 */
module.exports = function (devServer) {
  devServer.use(function (req, res, next) {
    mockServer(req, res, next)
  })
}
