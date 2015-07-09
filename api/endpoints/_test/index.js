'use strict';

var sinon = require('sinon');
var _ = require('lodash');

var testGet = require('./get');
var testPost = require('./post');
var testPut = require('./put');
var testMissingParameter = require('./missing-parameter');
var testRequestError = require('./request-error');

var ApiMethodTest = function(ApiEndpoint, method) {
  this.ApiEndpoint = ApiEndpoint;
  this.method = method;

  this.request = {};

  this.payload = {};
  this.options = {};

  this._requestRespondWith = {
    body: {
      someData: 1
    }
  };

  _.extend(this, testGet, testPost, testPut, testMissingParameter, testRequestError);
};

ApiMethodTest.prototype = {

  withArgs: function(payload, options) {
    this.payload = payload;
    this.options = options || {};
    return this;
  },


  requestResponseWith: function(data) {
    this._requestRespondWith = data;
    return this;
  },


  _getRequestStub: function() {
    return {
      get: sinon.stub().returns(Promise.resolve(this._requestRespondWith)),
      post: sinon.stub().returns(Promise.resolve(this._requestRespondWith)),
      put: sinon.stub().returns(Promise.resolve(this._requestRespondWith))
    };
  }

};


module.exports = function(ApiEndpoint, method) {
  return new ApiMethodTest(ApiEndpoint, method);
};
