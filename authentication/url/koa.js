'use strict';


const { createLogger } = require('@emartech/json-logger');
const logger = createLogger('suite-sdk');

var Authenticator = require('./');

module.exports.getMiddleware = function(options) {
  return async function(ctx, next) {
    var authenticator = Authenticator.create(options);
    var request = ctx.request;

    logger.info('authentication_url', {
      url: request.url,
      host: request.header.host
    });

    try {
      authenticator.authenticate(request.url, request.header.host);
      request.validatedData = ['GET', 'HEAD'].includes(request.method) ? request.query : request.body;
    } catch (ex) {
      logger.error('authentication_url_error', ex.message, ex);
      ctx.throw(401, ex.message);
    }

    return next();
  };
};
