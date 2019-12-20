const rp = require('request-promise-native')
const config = require('../../config')

async function calculate (req, h) {
  try {
    // payload with charge request details
    const payload = req.payload

    const result = await rp(buildRequest(payload))

    return h.response(buildReply(result))

    // return rp(buildRequest(payload))
    //   .then((data) => {
    //     return h.response(buildReply(data))
    //   })
    //   .catch((error) => {
    //     return replyWithError(h, error)
    //   })
  } catch (error) {
    const payload = replyWithError(error)
    return h.response(payload).code(500)
  }
}

function replyWithError (error) {
  let payload = {}

  if (typeof error.error !== 'undefined' && error.error !== null) {
    payload = { calculation: { messages: error.error.message } }
  } else {
    payload = { calculation: { messages: error.message } }
  }
  console.log('========== Handling error from Rules service ==========')
  console.log(payload)
  console.log('=======================================================')
  return payload
}

function buildRequest (payload) {
  // Rules service details
  const service = config.decisionService
  // The rules service end-points are per regime
  const regime = payload.regime
  // Charge financial year is used to infer version of end-point application
  const year = payload.financialYear
  // Charge request data to pass to rules service
  const chargeRequest = payload.chargeRequest

  const options = {
    method: 'POST',
    uri: makeRulesPath(regime, year),
    body: {
      tcmChargingRequest: chargeRequest
    },
    json: true,
    auth: {
      username: service.username,
      password: service.password
    }
  }
  if (config.environment.httpProxy) {
    options.proxy = config.environment.httpProxy
  }

  return options
}

function buildReply (data) {
  return ({
    uuid: data.__DecisionID__,
    generatedAt: new Date(),
    calculation: data.tcmChargingResponse
  })
}

function makeRulesPath (regime, year) {
  // generate the url for the correct regime, year and ruleset
  const endpoint = config.decisionService.endpoints[regime.toLowerCase()]
  const fy = '_' + year + '_' + (year - 1999)
  return (
    config.decisionService.url + '/' + endpoint.application + '/' + endpoint.ruleset + fy
  )
}

const routes = [
  {
    method: 'POST',
    path: '/v1/calculate-charge',
    handler: calculate
  }
]

module.exports = {
  calculate,
  replyWithError,
  buildRequest,
  buildReply,
  makeRulesPath,
  routes
}
