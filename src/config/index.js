require('dotenv').config()
const joi = require('@hapi/joi')
const environment = process.env.NODE_ENV || 'development'

const config = {
  environment: {
    name: environment,
    development: environment === 'development',
    test: environment === 'test',
    production: environment === 'production',
    httpProxy: process.env.http_proxy,
    httpsProxy: process.env.https_proxy
  },

  server: {
    port: process.env.PORT,
    router: {
      isCaseSensitive: false,
      stripTrailingSlash: true
    },
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    }
  },

  decisionService: {
    url: process.env.DECISION_SERVICE_URL,
    username: process.env.DECISION_SERVICE_USER,
    password: process.env.DECISION_SERVICE_PASSWORD,
    endpoints: {
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
  }
}

// Define config schema
const schema = joi.object({
  environment: joi.object({
    name: joi.string().valid('development', 'test', 'production').default('development'),
    development: joi.boolean().default(true),
    test: joi.boolean().default(false),
    production: joi.boolean().default(false),
    httpProxy: joi.string().allow(null),
    httpsProxy: joi.string().allow(null)
  }),
  server: joi.object({
    port: joi.number().default(3002).required(),
    router: joi.object({
      isCaseSensitive: joi.boolean().default(false),
      stripTrailingSlash: joi.boolean().default(true)
    }).optional(),
    routes: joi.optional()
  }),
  decisionService: joi.object({
    url: joi.string().required(),
    username: joi.string().required(),
    password: joi.string().required(),
    endpoints: joi.object({
      cfd: {
        application: joi.string().required(),
        ruleset: joi.string().required()
      },
      pas: {
        application: joi.string().required(),
        ruleset: joi.string().required()
      },
      wml: {
        application: joi.string().required(),
        ruleset: joi.string().required()
      }
    })
  })
})

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

// Use the joi validated value
module.exports = result.value
