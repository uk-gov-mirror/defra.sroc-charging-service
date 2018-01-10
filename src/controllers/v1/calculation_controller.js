'use strict'

const rp = require('request-promise')
const config = require('../../config/config')

module.exports = class CalculationController {
  constructor (request, reply, errors) {
    this.request = request
    this.reply = reply
  }

  calculate () {
    try {
      // payload with charge request details
      const payload = this.request.payload

      rp(this.buildRequest(payload))
        .then((data) => {
          this.reply(this.buildReply(data))
        })
        .catch((error) => {
          this.replyWithError(error)
        })
    } catch (error) {
      this.replyWithError(error)
    }
  }

  replyWithError (error) {
    let payload = {}

    try {
      if (typeof(error.error) !== "undefined" && error.error !== null) {
        payload = { calculation: { messages: error.error.message } }
      } else {
        payload = { calculation: { messages: error.message } } 
      }
      console.log("========== Handling error from Rules service ==========")
      console.log(payload)
      console.log("=======================================================")
      this.reply(payload).code(500)
    } catch (err) {
      console.log(err)
    }
  }

  buildRequest (payload) {
    // Rules service details
    const service = config.decisionService
    // The rules service end-points are per regime
    const regime = payload.regime
    // Charge financial year is used to infer version of end-point application
    const year = payload.financialYear
    // Charge request data to pass to rules service
    const chargeRequest = payload.chargeRequest

    let options = {
      method: 'POST',
      uri: this.makeRulesPath(regime, year),
      body: {
        tcmChargingRequest: chargeRequest
      },
      json: true,
      auth: {
        username: service.username,
        password: service.password
      }
    }
    if (config.httpProxy) {
      options['proxy'] = config.httpProxy
    }

    return options
  }

  buildReply (data) {
    return ({
      uuid: data.__DecisionID__,
      generatedAt: new Date(),
      calculation: data.tcmChargingResponse
    })
  }

  makeRulesPath (regime, year) {
    // generate the url for the correct regime, year and ruleset
    const endpoint = config.endpoints[regime.toLowerCase()]
    const fy = '_' + year + '_' + (year - 1999)
    return (
      config.decisionService.url + '/' + endpoint.application + '/' + endpoint.ruleset + fy
    )
  }

  makeOldRulesPath (regime, year) {
    // generate the url for the correct regime, year and ruleset
    const endpoint = config.endpoints[regime.toLowerCase()]
    return (
      config.decisionService.url + '/' + endpoint.application + '/' + endpoint.ruleset
    )
  }

  static handler (request, reply, source, errors) {
    return new CalculationController(request, reply, errors).calculate()
  }
}
