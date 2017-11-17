'use strict'

const Hapi = require('hapi')
const HapiRouter = require('hapi-router')
const config = require('./src/config/config')
const Good = require('good')
const server = new Hapi.Server()

server.connection({
  port: config.port
})

server.register([
  {
    register: Good,
    options: {
      reporters: {
        console: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{
            response: '*',
            log: '*'
          }]
        }, {
          module: 'good-console'
        }, 'stdout']
      }
    }
  }, {
    register: HapiRouter,
    options: {
      routes: './src/routes/*.js'
    }
  }
], (err) => {
  if (err) {
    // error loading plugins
    throw err
  }

  server.start((err) => {
    if (err) {
      throw err
    }
    server.log('info', `${process.env.NODE_ENV} - Server running at: ${server.info.uri}`)
  })
})
