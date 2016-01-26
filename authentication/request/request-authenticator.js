'use strict';

class RequestAuthenticator {

  constructor(context) {
    this._context = context;
  }

  *authenticate() {
    this._validate();

    yield this._context.authenticateEscher;
  }

  _validate() {
    if (!this._context.authenticateEscher instanceof Promise) {
      throw new Error('Context is not decorated. Use interceptor middleware first.');
    }
  }

  static create(context) {
    return new RequestAuthenticator(context);
  }
}

module.exports = RequestAuthenticator;
