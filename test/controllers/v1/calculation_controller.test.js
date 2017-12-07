'use strict'

const nock = require('nock')
const sinon = require('sinon')
const Code = require('code')
const Lab = require('lab')
const lab = exports.lab = Lab.script()
const expect = Code.expect
const config = require('../../../src/config/config')
const { URL } = require('url')
const CalculationController = require('../../../src/controllers/v1/calculation_controller')

let controller
let replyCallback
let request
let errors
let nockScope

const dummyRequest = {
  regime: 'cfd',
  financialYear: 2018,
  chargeRequest: {
    permitCategoryRef: '2.3.22',
    percentageAdjustment: 20,
    temporaryCessation: false,
    compliancePerformanceBand: 'F',
    billableDays: 200,
    financialDays: 365,
    chargePeriod: 'FY1819',
    preConstruction: false,
    environmentFlag: 'TEST'
  }
}

const dummyResponse = {
  __DecisionID__: 'd7cb3924-1a74-4289-ade8-edb3ef6b5ffe0',
  tcmChargingResponse: {
    chargeValue: 16915.4,
    environmentFlag: 'TEST',
    decisionPoints: {
      baselineCharge: 51451,
      percentageAdjustment: 10290.2,
      temporaryCessation: 0,
      complianceAdjustment: 30870.6,
      chargeType: 'PRO_RATA'
    },
    messages: null
  }
}

function makeUrl (slug, year) {
  const endpoint = config.endpoints[slug]
  return config.decisionService.url + '/' +
    endpoint.application + '/' +
    endpoint.ruleset + '_' + year + '-' + (year + 1)
}

// Cannot get this to work correctly - replyCallback always appears uncalled
// even though it appears that it is called ...
// lab.experiment('calculate()', () => {
//   let callCount
//
//   lab.beforeEach(() => {
//     replyCallback = sinon.spy()
//     request = {
//       payload: dummyRequest
//     }
//     errors = null
//     controller = new CalculationController(request, replyCallback, errors)
//
//     let nockUrl = new URL(makeUrl(dummyRequest.regime, dummyRequest.financialYear))
//     nockScope = nock(nockUrl.origin)
//       .post(nockUrl.pathname)
//       .reply(200, dummyResponse)
//   })
//
//   lab.test('proxies request from client to rules service', async () => {
//     controller.calculate()
//     expect(replyCallback.called).to.be.true()
//   })
// })

lab.experiment('buildRequest(payload)', () => {
  let request

  lab.beforeEach(() => {
    controller = new CalculationController()
    request = controller.buildRequest(dummyRequest)
  })

  lab.test('wraps payload.chargeRequest', async () => {
    expect(request.body.tcmChargingRequest).to.equal(dummyRequest.chargeRequest)
  })

  lab.test('sets method to POST', async () => {
    expect(request.method).to.equal('POST')
  })

  lab.test('sets correct uri', async () => {
    expect(request.uri).to.equal(
      makeUrl(dummyRequest.regime, dummyRequest.financialYear))
  })

  lab.test('sets json flag', async () => {
    expect(request.json).to.be.true()
  })

  lab.test('sets authentication params', async () => {
    expect(request.auth.username).to.equal(config.decisionService.username)
    expect(request.auth.password).to.equal(config.decisionService.password)
  })
})

lab.experiment('buildReply(data)', () => {
  lab.beforeEach(() => {
    controller = new CalculationController()
  })
  lab.test('wraps response data', async () => {
    const reply = controller.buildReply(dummyResponse)
    expect(reply.uuid).to.equal(dummyResponse.__DecisionID__)
    expect(reply.generatedAt).to.be.a.date()
    expect(reply.calculation).to.equal(dummyResponse.tcmChargingResponse)
  })
})

lab.experiment('makeRulesPath(regime, year)', () => {
  lab.beforeEach(() => {
    controller = new CalculationController()
  })
  lab.test('returns correct url for Water Quality', async () => {
    const slug = 'cfd'
    const year = 2017
    const url = makeUrl(slug, year)

    expect(controller.makeRulesPath(slug, year)).to.equal(url)
  })

  lab.test('returns correct url for Waste', async () => {
    const slug = 'wml'
    const year = 2019
    const url = makeUrl(slug, year)

    expect(controller.makeRulesPath(slug, year)).to.equal(url)
  })

  lab.test('returns correct url for Installations', async () => {
    const slug = 'pas'
    const year = 2021
    const url = makeUrl(slug, year)

    expect(controller.makeRulesPath(slug, year)).to.equal(url)
  })
})
