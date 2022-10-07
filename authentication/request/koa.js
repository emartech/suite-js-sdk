'use strict';

var logger = require('logentries-logformat')('suite-sdk');
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
