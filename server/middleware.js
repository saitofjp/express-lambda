let config = require('../nuxt.config.js')

const customDomainAdaptorMiddleware = (req, res, next) => {
    const apigatewayHeader = req.headers['x-apigateway-event'];

    if (apigatewayHeader === undefined) {
      next()
      return
    }

    req.url = req.originalUrl = `${config.router.base}${req.url}`.replace('//', '/')

    next()
};

module.exports = {customDomainAdaptorMiddleware};