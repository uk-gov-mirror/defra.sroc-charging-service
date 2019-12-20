const Boom = require('@hapi/boom')
const calculation = require('../controllers/v1/calculation_controller').routes

const routes = [
  ...calculation,
  {
    method: 'GET',
    path: '/status',
    handler: (request, h) => {
      return { status: 'ok' }
    }
  },
  {
    method: '*',
    path: '/{any*}',
    handler: (request, h) => {
      return Boom.notFound()
    }
  }
]

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
