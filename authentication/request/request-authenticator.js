'use strict';

var Escher = require('escher-auth');
var KeyPool = require('escher-keypool');


class RequestAuthenticator {

  constructor(config, context) {
    this._escher = Escher.create({
      algoPrefix: 'EMS',
      vendorKey: 'EMS',
      authHeaderName: 'X-EMS-Auth',
      dateHeaderName: 'X-EMS-Date',
      credentialScope: config.credentialScope
    });

    this._config = config;
    this._context = context;
  }


  authenticate() {
    this._escher.authenticate(this._getRequest(), this._getKeyDb());
  }


  _getRequest() {
    var request = this._context.req;

    if (this._hasRequestBody()) {
      request.body = JSON.stringify(this._context.request.body);
    }

    return request;
  }


  _hasRequestBody() {
    return Object.keys(this._context.request.body).length > 0;
  }


  _getKeyDb() {
    if (this._config.keyPool) return KeyPool.create(this._config.keyPool).getKeyDb();
    return function() {};
  }


  static create(config, context) {
    return new RequestAuthenticator(config, context);
  }

}


module.exports = RequestAuthenticator;
