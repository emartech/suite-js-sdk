'use strict';

var FlipperAPI = require('./');
var sinon = require('sinon');
var expect = require('chai').expect;

describe('Suite Service Flipper', function () {
  var request;
  var flipper;

  describe('Flipper ON', function* () {

    it('should check flipper status with a Suite api call', function* () {
      requestPromiseRespondWith({ flipper: { is_on: true }});
      var returnValue = yield flipper.isOn(1, 'test');

      expect(request.get).to.have.been.calledWithMatch('/customers/1/flippers/test');
      expect(returnValue).to.eql(true);
    });

  });


  describe('Flipper OFF', function* () {

    it('should check flipper status with a Suite api call', function* () {
      requestPromiseRespondWith({ flipper: { is_on: false }});
      var returnValue = yield flipper.isOn(2, 'test');

      expect(request.get).to.have.been.calledWithMatch('/customers/2/flippers/test');
      expect(returnValue).to.eql(false);
    });

  });


  it('should log errors and return false', function* () {
    requestPromiseRejectWith(new Error('404'));
    var returnValue = yield flipper.isOn(1, 'test');

    expect(request.get).to.have.been.calledWithMatch('/customers/1/flippers/test');
    expect(returnValue).to.eql(false);
  });


  function requestPromiseRespondWith(respObj) {
    var respPromise = new Promise(function (resolve) {
      resolve(respObj);
    });

    request = {
      get: sinon.stub().returns(respPromise),
      post: sinon.stub().returns(respPromise)
    };
    flipper = new FlipperAPI(request);
  }


  function requestPromiseRejectWith(respObj) {
    var respPromise = new Promise(function (_, reject) {
      reject(respObj);
    });

    request = {
      get: sinon.stub().returns(respPromise)
    };
    flipper = new FlipperAPI(request);
  }

});
