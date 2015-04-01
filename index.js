module.exports = {

  api: require('./api/'),

  authentication: {
    koaMiddleware: require('./authentication/url/koa')
  },

  translations: {
    koaMiddleware: require('./translations/middleware'),
    RenderDecorator: require('./translations/render-decorator'),
    Collect: require('./translations/collect'),
    Translator: require('./translations/translator')
  },

  lib: {
    dateHelper: require('./lib/date-helper'),
    passwordGenerator: require('./lib/password-generator'),
    request: require('./lib/internal-api-request'),
    superadminChecker: require('./lib/superadmin-checker')
  }

};