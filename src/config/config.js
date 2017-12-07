require('dotenv').config()

const config = module.exports = {}

config.nodeEnvironment = process.env.NODE_ENV || 'production'
config.port = process.env.PORT || 3002

// proxy
config.httpProxy = process.env.http_proxy
config.httpsProxy = process.env.https_proxy

// Decision service config
config.decisionService = {
  url: process.env.DECISION_SERVICE_URL,
  username: process.env.DECISION_SERVICE_USER,
  password: process.env.DECISION_SERVICE_PASSWORD
}
// Decision service end-points for each regime
config.endpoints = {
  cfd: {
    application: process.env.CFD_APP,
    ruleset: process.env.CFD_RULESET
  },
  pas: {
    application: process.env.PAS_APP,
    ruleset: process.env.PAS_RULESET
  },
  wml: {
    application: process.env.WML_APP,
    ruleset: process.env.WML_RULESET
  }
}
