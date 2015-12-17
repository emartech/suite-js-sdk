'use strict';

var logger = require('logentries-logformat')('suite-sdk');
var RequestAuthenticator = require('./request-authenticator');

module.exports.getMiddleware = function(escherConfig) {
  return function* (next) {
    try {
      RequestAuthenticator.create(escherConfig, this).authenticate();
      if (next) {
        yield next;
      }
    } catch (ex) {
      logger.error('authentication_request_error', ex.message, ex);
      this.throw(401, ex.message);
    }
  };
};
