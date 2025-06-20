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

    if (this._context.request.rawBody) {
      request.body = this._context.request.rawBody;
    }

    return request;
  }


  _getKeyDb() {
    if (this._config.keyPool) {
      return KeyPool.create(this._config.keyPool).getKeyDb();
    }
    return function() {};
  }


  static create(config, context) {
    return new RequestAuthenticator(config, context);
  }

}


module.exports = RequestAuthenticator;
