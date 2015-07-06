'use strict';

var RequestAuthenticator = require('./request-authenticator');

module.exports.getMiddleware = function(escherConfig) {
  return function* (next) {
    try {
      RequestAuthenticator.create(escherConfig, this).authenticate();
      if (next) yield next;
    } catch (ex) {
      this.throw(401, ex.message);
    }
  };
}
