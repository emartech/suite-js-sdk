'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('lodash');
var APIRequiredParameterMissingError = require('./api/endpoints/_base/error');

var ApiMethodTest = function(ApiEndpoint, method) {
  this.ApiEndpoint = ApiEndpoint;
  this.method = method;

  this.request = {};

  this.payload = {};
  this.options = {};

  this.expectedReturnValue = { result: 'fromSuiteRequest' };
};

ApiMethodTest.prototype = {

  withArgs: function(payload, options) {
    this.payload = payload;
    this.options = options || {};
    return this;
  },


  shouldGetResultFromEndpoint: function(expectedUrl) {
    var _this = this;
    var apiEndpoint;
    var request;

    describe('towards ' + expectedUrl + ' endpoint', function() {
      beforeEach(function() {
        request = this._getRequestStub();
        apiEndpoint = this.ApiEndpoint.create(request, { customerId: 123 });
      }.bind(this));

      it('should properly call a GET request', function* () {
        yield apiEndpoint[_this.method](_this.payload, _this.options);
        expect(request.get).to.have.been.callCount(1);
        expect(request.get).to.have.been.calledWith(123, expectedUrl, {});
      });


      it('should return the result', function* () {
        var result = yield apiEndpoint[_this.method](_this.payload, _this.options);
        expect(request.get).to.have.been.callCount(1);
        expect(result).to.eql(_this.expectedReturnValue);
      });


      it('should pass the options to the suite request', function* () {
        var options = _.merge({ customerId: 999, environment: 'otherEnv' }, _this.options);
        yield apiEndpoint[_this.method](_this.payload, options);
        expect(request.get).to.have.been.callCount(1);
        expect(request.get).to.have.been.calledWithExactly(sinon.match.any, sinon.match.any, options);
      });


      it('should override customerId from the options', function* () {
        yield apiEndpoint[_this.method](_this.payload, { customerId: 999 });
        expect(request.get).to.have.been.callCount(1);
        expect(request.get).to.have.been.calledWithExactly(999, sinon.match.any, { customerId: 999 });
      });
    }.bind(this));
  },


  shouldPostToEndpoint: function(expectedUrl, expectedPayload) {
    var _this = this;
    var apiEndpoint;
    var request;

    describe('towards ' + expectedUrl + ' endpoint', function() {
      beforeEach(function() {
        request = this._getRequestStub();
        apiEndpoint = this.ApiEndpoint.create(request, { customerId: 123 });
      }.bind(this));

      it('should properly call a POST request', function* () {
        yield apiEndpoint[_this.method](_this.payload, _this.options);
        expect(request.post).to.have.been.callCount(1);
        expect(request.post).to.have.been.calledWith(123, expectedUrl, expectedPayload, {});
      });


      it('should return the result', function* () {
        var result = yield apiEndpoint[_this.method](_this.payload, _this.options);
        expect(request.post).to.have.been.callCount(1);
        expect(result).to.eql(_this.expectedReturnValue);
      });


      it('should pass the options to the suite request', function* () {
        var options = _.merge({ customerId: 999, environment: 'otherEnv' }, _this.options);
        yield apiEndpoint[_this.method](_this.payload, options);
        expect(request.post).to.have.been.callCount(1);
        expect(request.post).to.have.been.calledWithExactly(sinon.match.any, sinon.match.any, sinon.match.any, options);
      });


      it('should override customerId from the options', function* () {
        yield apiEndpoint[_this.method](_this.payload, { customerId: 999 });
        expect(request.post).to.have.been.callCount(1);
        expect(request.post).to.have.been.calledWithExactly(999, sinon.match.any, sinon.match.any, { customerId: 999 });
      });
    }.bind(this));
  },


  shouldThrowMissingParameterError: function(missingParameters) {
    missingParameters = _.isArray(missingParameters) ? missingParameters : [missingParameters];
    var _this = this;

    describe('without ' + missingParameters.join() + ' parameter' + (missingParameters.length > 1 ? 's' : ''), function() {
      it('should throw a MissingParameterError', function* () {
        var apiEndpoint = _this.ApiEndpoint.create(_this._getRequestStub(), { customerId: 123 });

        try {
          yield apiEndpoint[_this.method](_this.payload, _this.options);
        } catch(ex) {
          expect(ex).to.be.an.instanceof(APIRequiredParameterMissingError);
          return;
        }

        throw new Error('Error not thrown!');
      });
    });
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
