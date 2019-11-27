const awsServerlessExpress = require('aws-serverless-express')
const express = require('express')
const { Nuxt, Builder } = require('nuxt')
const { customDomainAdaptorMiddleware } = require('./middleware');
const app = express()

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = false

async function initApp() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(customDomainAdaptorMiddleware)
  app.use(nuxt.render)

  return app
}

var server = undefined;
const binaryMimeTypes = [
  'application/javascript',
  'application/json',
  'application/octet-stream',
  'application/xml',
  'font/eot',
  'font/opentype',
  'font/otf',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'text/comma-separated-values',
  'text/css',
  'text/html',
  'text/javascript',
  'text/plain',
  'text/text',
  'text/xml'
]

exports.handler = (event, context) => {
  initApp().then((app) => {
    if (server === undefined) {
      server = awsServerlessExpress.createServer(app, null, binaryMimeTypes)
    }
    awsServerlessExpress.proxy(server, event, context)
  })
}