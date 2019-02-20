'use strict'

module.exports = [{
  method: 'GET',
  path: '/status',
  config: {
    description: 'Heathcheck status',
    handler: function (request, reply, source, errors) {
      reply({ status: "ok"}).code(200)
    }
  }
}]
