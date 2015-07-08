'use strict';

var sinon = require('sinon');
var _ = require('lodash');

var testGet = require('./get');
var testPost = require('./post');
var testPut = require('./put');
var testMissingParameter = require('./missing-parameter');

var ApiMethodTest = function(ApiEndpoint, method) {
  this.ApiEndpoint = ApiEndpoint;
  this.method = method;

  this.request = {};

  this.payload = {};
  this.options = {};

  this.expectedReturnValue = { result: 'fromSuiteRequest' };

  _.extend(this, testGet, testPost, testPut, testMissingParameter);
};

ApiMethodTest.prototype = {

  withArgs: function(payload, options) {
    this.payload = payload;
    this.options = options || {};
    return this;
  },


  _getRequestStub: function() {
    return {
      get: sinon.stub().returns(Promise.resolve(this.expectedReturnValue)),
      post: sinon.stub().returns(Promise.resolve(this.expectedReturnValue)),
      put: sinon.stub().returns(Promise.resolve(this.expectedReturnValue))
    };
  }

};


module.exports = function(ApiEndpoint, method) {
  return new ApiMethodTest(ApiEndpoint, method);
};
