'use strict';


const { createLogger } = require('@emartech/json-logger');
const logger = createLogger('suite-sdk');

var RequestAuthenticator = require('./request-authenticator');

module.exports.getMiddleware = function(escherConfig) {
  return async function(ctx, next) {
    try {
      RequestAuthenticator.create(escherConfig, ctx).authenticate();
    } catch (ex) {
      logger.error('authentication_request_error', ex.message, ex);
      ctx.throw(401, ex.message);
    }

    return next();
  };
};
