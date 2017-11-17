'use strict'

const CalculationControllerV1 = require('../controllers/v1/calculation_controller')

module.exports = [{
  method: 'POST',
  path: '/v1/calculate-charge',
  config: {
    description: 'Invoke a calculation endpoint',
    handler: CalculationControllerV1.handler
  }
}]
