'use strict';

var logger = require('logentries-logformat')('suite-sdk');
var Authenticator = require('./');

module.exports.getMiddleware = function(options) {
  return async function(ctx, next) {
    var authenticator = Authenticator.create(options);
    var request = ctx.request;

    logger.log('authentication_url', {
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
