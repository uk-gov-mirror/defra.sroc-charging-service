'use strict'

const axios = require('axios')
const config = require('../../config/config')
const url = require('url')

module.exports = class CalculationController {
  constructor(request, reply, errors) {
    this.request = request
    this.reply = reply
  }

  calculate() {
    try {
      // Rules service details
      const service = config.decisionService

      // payload with charge request details
      const payload = this.request.payload

      // The rules service end-points are per regime
      const regime = payload.regime

      // Charge financial year is used to infer version of end-point application
      const year = payload.financialYear

      // Charge request data to pass to rules service
      const chargeRequest = payload.chargeRequest

      // TODO: check params for validity
      //
      let options = {
        auth: {
          username: service.username,
          password: service.password
        }
      }
      if (config.httpProxy) {
        let proxy = url.parse(config.httpProxy)
        options['proxy'] = {
          host: proxy.hostname,
          port: proxy.port
        }
      }

      axios.post(this.makeRulesPath(regime, year), {
        tcmChargingRequest: chargeRequest
      },
        options
      )
      .then(res => {
        // TODO: we could decorate this response if we wanted to here...
        this.reply(this.buildReply(res.data))
      })
    } catch( error ) {
      console.log(error)
      this.reply({ error: error })
    }
  }

  buildReply(data) {
    return({
      uuid: data.__DecisionID__,
      generatedAt: new Date(),
      calculation: data.tcmChargingResponse
    })
  }

  makeRulesPath(regime, year) {
    //TODO: generate the url for the correct regime, year and ruleset
    const endpoint = config.endpoints[regime.toLowerCase()]

    return(
      config.decisionService.url + '/' + endpoint.application + '/' + endpoint.ruleset
    )
  }

  static handler(request, reply, source, errors) {
    return new CalculationController(request, reply, errors).calculate()
  }
}
