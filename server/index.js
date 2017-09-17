const express = require('express')
const logger = require('./logger')

const argv = require('minimist')(process.argv.slice(2))
const setup = require('./middlewares/frontendMiddleware')
const isDev = process.env.NODE_DEV !== 'production'
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false
const resolve = require('path').resolve
const app = express()

const customHost = argv.host || process.env.HOST
const host = customHost || null
const prettyHost = customHost || 'localhost'
const port = argv.port || process.env.PORT || 3000

setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/'
})

if(process.env.NODE_DEV !== 'production'){
  const https = require('https')
  const options = {
    key: process.env.SERVER_PRIVATE_KEY,
    cert: process.env.SERVER_CERT
  }
  const secureServer = https.createServer(options, app).listen(port)
  app.set('port_https', port)
}else{
  app.listen(port, host, (err) => {
    if(err){
      return logger.error(err.message)
    }
  
    if(ngrok){
      ngrok.connect(port, (innerErr, url) => {
        if(innerErr){
          return logger.error(innerErr)
        }
        
        logger.appStarted(port, prettyHost, url)
      })
    }else{
      logger.appStarted(port, prettyHost)
    }
  })
}

