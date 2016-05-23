'use strict';

var logger = require('logentries-logformat')('suite-sdk');
var Authenticator = require('./');

module.exports.getMiddleware = function(options) {
  return function* (next) {
    var authenticator = Authenticator.create(options);
    var request = this.request;

    logger.log('authentication_url', {
      url: request.url,
      host: request.header.host
    });

    try {
      authenticator.authenticate(request.url, request.header.host);
      request.validatedData = (request.method === 'GET') ? request.query : request.body;
    } catch (ex) {
      logger.error('authentication_url_error', ex.message, ex);
      this.throw(401, ex.message);
    }

    if (next) {
      yield next;
    }
  };
};
