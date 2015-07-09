'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('lodash');


var SDKMethodTest = function(API, sdkMethods) {
  this.API = API;
  this.sdkMethods = sdkMethods;
};

SDKMethodTest.prototype = {

  run: function() {
    _.forIn(this.sdkMethods, this._runSDKMethodTestCases, this);
  },


  _runSDKMethodTestCases: function(testCases, methodName) {
    describe('#' + methodName, function() {
      _.each(this._createCollectionFrom(testCases), function(testCase) {
        this._runSDKMethodTestCase(methodName, testCase);
      }, this);
    }.bind(this));
  },


  _runSDKMethodTestCase: function(methodName, testCase) {
    (new SDKMethodTestCase(this.API, methodName, testCase)).run();
  },


  _createCollectionFrom: function(testCases) {
    return _.isArray(testCases) ? testCases : [testCases];
  }

};



var SDKMethodTestCase = function(API, methodName, testCase) {
  this.API = API;
  this.methodName = methodName;
  this.testCase = testCase;

  this.customerId = null;
  this._requestRespondWith = null;
  this.request = null;
  this.api = null;
  this.options = {};
};


SDKMethodTestCase.prototype = {

  run: function() {
    it('should send an api call and return with the expected response', function() {
      this._arrange();
      this._act();
      this._assert();
    }.bind(this));

    it('should return with the expected response', function() {
      this._arrange();
      var result = this._act();
      expect(result).to.equal(this._requestRespondWith);
    }.bind(this));
  },


  _arrange: function() {
    this.customerId = 12;
    this.options.customerId = this.customerId;
    this._requestRespondWith = { dataFromSuite: 'data' };
    this.request = {
      get: sinon.stub().returns(this._requestRespondWith),
      post: sinon.stub().returns(this._requestRespondWith),
      put: sinon.stub().returns(this._requestRespondWith)
    };
    this.api = new this.API(this.request);
  },


  _act: function() {
    var args = [];
    if (this.testCase.arguments) args = args.concat(this.testCase.arguments);
    if (this.testCase.payload) args.push(this.testCase.payload);
    args.push({
      customerId: this.customerId
    });
    return this._callSDKMethodWith(args);
  },


  _assert: function() {
    if (this.testCase.payload) {
      expect(this._method()).to.have.been.calledWith(this.customerId, this.testCase.expectedUrl, this.testCase.expectedPayload, this.options);
    } else {
      expect(this._method()).to.have.been.calledWith(this.customerId, this.testCase.expectedUrl, this.options);
    }
  },


  _callSDKMethodWith: function(args) {
    return this.api[this.methodName].apply(this.api, args);
  },


  _method: function() {
    return this.request[this.testCase.method];
  }
};



module.exports = {
  testSDKMethodResponse: function(API, sdkMethods) {
    (new SDKMethodTest(API, sdkMethods)).run();
  }
};
