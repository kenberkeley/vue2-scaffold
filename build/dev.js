var DEV_SERVER_PORT = 8000
var opn = require('opn')
var devIp = require('dev-ip')
var express = require('express')
var webpack = require('webpack')
var getPort = require('get-port')
var bodyParser = require('body-parser')
var PATHS = require('./config/PATHS')
var devServer = express()

devServer.use(bodyParser.json())
devServer.use(bodyParser.urlencoded({ extended: false }))

devServer.use('/static', express.static(PATHS.STATIC))

/**
 * mock server setup
 */
require('./mock')(devServer)

/**
 * handle fallback for HTML5 history API
 */
devServer.use(require('connect-history-api-fallback')())

/**
 * webpack setup
 */
var compiler = webpack(require('./webpack.dev.conf'))
var webpackDevMiddleWare = require('webpack-dev-middleware')(compiler, { noInfo: true })

// serve webpack bundle output
devServer.use(webpackDevMiddleWare)

// enable hot-reload / state-preserving / compilation error display
devServer.use(require('webpack-hot-middleware')(compiler))

/**
 * launch!
 */
getPort({ port: DEV_SERVER_PORT }).then(function (port) {
  devServer.listen(port, function () {
    webpackDevMiddleWare.waitUntilValid(function () {
      console.info(
        'Dev Server is running on\n',
        '[LOCAL] localhost:' + port,
        '[LAN] ' + devIp()[0] + ':' + port,
        '\n'
      )
      opn('http://localhost:' + port)
    })
  })
})
