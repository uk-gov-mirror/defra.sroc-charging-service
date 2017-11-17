# SRoC Charging Service

A lightweight wrapper service to abstract away and simplify calls into the rules/decision engine service. This charging service determines which rules service endpoint to call and repackages the JSON payload of the callers request to suit.  The rules service calculates charges based upon the artifacts provided in the request payload and returns a charge and decision points in its response. The response is then repackaged by the charging service and returned to the caller.

NOTE: This is currently a prototype and expected to be used as an internally facing service in its current form i.e. not secure for public facing networks.

## Prerequisites

Please make sure the following are installed:

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Node.js v8.*](https://nodejs.org/en/)
- [StandardJS](https://standardjs.com/) using `npm install -g standard`

## Installation

Clone the repository and install its package dependencies:

```bash
git clone https://github.com/DEFRA/sroc-charging-service.git && cd sroc-charging-service
npm install
```

## Contributing to this project

If you have an idea you'd like to contribute please log an issue.

All contributions should be submitted via a pull request.

## License

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

>Contains public sector information licensed under the Open Government license v3

### About the license

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
