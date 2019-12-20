const Code = require('@hapi/code')
const Lab = require('@hapi/lab')
const { before, describe, it } = exports.lab = Lab.script()
const { expect } = Code
const config = require('../../../src/config')
const controller = require('../../../src/controllers/v1/calculation_controller')

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
  const endpoint = config.decisionService.endpoints[slug]
  return config.decisionService.url + '/' +
    endpoint.application + '/' +
    endpoint.ruleset + '_' + year + '_' + (year - 1999)
}

describe('buildRequest(payload)', () => {
  let request

  before(() => {
    request = controller.buildRequest(dummyRequest)
  })

  it('wraps payload.chargeRequest', async () => {
    expect(request.body.tcmChargingRequest).to.equal(dummyRequest.chargeRequest)
  })

  it('sets method to POST', async () => {
    expect(request.method).to.equal('POST')
  })

  it('sets correct uri', async () => {
    expect(request.uri).to.equal(
      makeUrl(dummyRequest.regime, dummyRequest.financialYear))
  })

  it('sets json flag', async () => {
    expect(request.json).to.be.true()
  })

  it('sets authentication params', async () => {
    expect(request.auth.username).to.equal(config.decisionService.username)
    expect(request.auth.password).to.equal(config.decisionService.password)
  })
})

describe('buildReply(data)', () => {
  it('wraps response data', async () => {
    const reply = controller.buildReply(dummyResponse)
    expect(reply.uuid).to.equal(dummyResponse.__DecisionID__)
    expect(reply.generatedAt).to.be.a.date()
    expect(reply.calculation).to.equal(dummyResponse.tcmChargingResponse)
  })
})

describe('makeRulesPath(regime, year)', () => {
  it('returns correct url for Water Quality', async () => {
    const slug = 'cfd'
    const year = 2017
    const url = makeUrl(slug, year)

    expect(controller.makeRulesPath(slug, year)).to.equal(url)
  })

  it('returns correct url for Waste', async () => {
    const slug = 'wml'
    const year = 2019
    const url = makeUrl(slug, year)

    expect(controller.makeRulesPath(slug, year)).to.equal(url)
  })

  it('returns correct url for Installations', async () => {
    const slug = 'pas'
    const year = 2021
    const url = makeUrl(slug, year)

    expect(controller.makeRulesPath(slug, year)).to.equal(url)
  })
})
