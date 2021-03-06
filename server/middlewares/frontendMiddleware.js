const express = require('express')
const path = require('path')
const compression = require('compression')
const pkg = require(path.resolve(process.cwd(), 'package.json'))
const fs = require('fs')

const githubAppMiddleware = require('./github')

const addDevMiddlewares = (app, webpackConfig) => {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const compiler = webpack(webpackConfig)
  const middleware = webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    silent: true,
    stats: 'errors-only'
  })

  app.use(middleware)
  app.use(webpackHotMiddleware(compiler))

  const mfs = middleware.fileSystem

  app.get('*', (req, res) => {
    mfs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {
      if(err){
        res.sendStatus(404)
      }else{
        res.send(file.toString())
      }
    })
  })
}

const addProdMiddlewares = (app, options) => {
  const publicPath = options.publicPath || '/'
  const outputPath = options.outputPath || path.resolve(process.cwd(), 'build')

  app.use(compression())
  app.use(publicPath, express.static(outputPath))

  app.get('*', (req, res) => res.sendFile(path.resolve(outputPath, 'index.html')))
}

module.exports = (app, options) => {
  const isProd = process.env.NODE_ENV === 'production'

  githubAppMiddleware(app, options)
  if(isProd){
    addProdMiddlewares(app, options)
  }else{
    const webpackConfig = require('../../internals/webpack/webpack.dev.babel')
    addDevMiddlewares(app, webpackConfig)
  }

  return app
}

  
