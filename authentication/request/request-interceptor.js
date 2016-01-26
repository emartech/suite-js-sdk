'use strict';

var Escher = require('escher-auth');
var KeyPool = require('escher-keypool');
var rawBody = require('raw-body');


class RequestInterceptor {

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

  intercept() {
    return rawBody(this._context.req).then(this._authenticate.bind(this));
  }

  _authenticate(originalBody) {
    return this._escher.authenticate(this._getRequest(originalBody.toString()), this._getKeyDb());
  }

  _getRequest(originalBody) {
    var request = Object.create(this._context.request);
    request.body = originalBody;

    return request;
  }

  _getKeyDb() {
    if (this._config.keyPool) {
      return KeyPool.create(this._config.keyPool).getKeyDb();
    }

    return function() {};
  }

  static create(config, context) {
    return new RequestInterceptor(config, context);
  }

}


module.exports = RequestInterceptor;
