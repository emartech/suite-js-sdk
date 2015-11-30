'use strict';

var expect = require('chai').expect;
var Escher = require('escher-auth');
var getMiddleware = require('./koa').getMiddleware;
var KeyPool = require('escher-keypool');
var sinon = require('sinon');

describe('Koa Escher Request Authentication Middleware', function() {
  var escherConfig;
  var next;

  var callMiddleware = function(context) {
    return getMiddleware(escherConfig).call(context, next);
  };

  var createContext = function(body) {
    return {
      req: { body: {} },
      request: { body: body },
      throw: sinon.stub()
    };
  };

  var createContextWithEmptyBody = function() {
    return createContext({});
  };

  beforeEach(function() {
    escherConfig = {
      credentialScope: 'testScope',
      keyPool: JSON.stringify([{ 'keyId': 'suite_cuda_v1', 'secret': 'testSecret', 'acceptOnly': 0 }])
    };

    /*eslint-disable*/
    next = function* () {};
    /*eslint-enable*/
  });


  describe('Escher library', function() {

    it('should be initialized with the proper Escher config', function* () {
      var fullConfig = {
        algoPrefix: 'EMS',
        vendorKey: 'EMS',
        authHeaderName: 'X-EMS-Auth',
        dateHeaderName: 'X-EMS-Date',
        credentialScope: 'testScope'
      };

      this.sandbox.stub(Escher, 'create');

      yield callMiddleware(createContextWithEmptyBody());

      expect(Escher.create).to.have.been.calledWith(fullConfig);
    });

  });

  describe('Escher #authenticate', function() {
    var escherStub;

    beforeEach(function() {
      escherStub = {
        authenticate: this.sandbox.stub()
      };

      this.sandbox.stub(Escher, 'create').returns(escherStub);
    });

    it('should have been called', function* () {
      yield callMiddleware(createContextWithEmptyBody());

      /*eslint-disable*/
      expect(escherStub.authenticate).to.have.been.called;
      /*eslint-enable*/
    });

    it(`should have been called with original Node request object decorated with the stringified body from the koa's request object`, function* () {
      var context = createContext({ testData: 'testValue' });
      yield callMiddleware(context);

      var expectedRequest = Object.create(context.req);
      expectedRequest.body = JSON.stringify(context.request.body);

      expect(escherStub.authenticate).to.have.been.calledWithExactly(expectedRequest, sinon.match.any);
    });


    it(`should have been called with original Node request object if the query body is empty`, function* () {
      var context = createContextWithEmptyBody();
      yield callMiddleware(context);

      var expectedRequest = Object.create(context.req);
      expectedRequest.body = context.request.body;

      expect(escherStub.authenticate).to.have.been.calledWithExactly(expectedRequest, sinon.match.any);
    });

    it(`should have been called with the proper keys using keypool from configuration`, function* () {
      this.sandbox.stub(KeyPool, 'create').returns({
        getKeyDb: this.sandbox.stub().returns('testKey')
      });

      yield callMiddleware(createContextWithEmptyBody());

      expect(KeyPool.create).to.have.been.calledWith(escherConfig.keyPool);
      expect(escherStub.authenticate).to.have.been.calledWithExactly(sinon.match.any, 'testKey');
    });

    it(`should throw an unauthorized error in the context if error happened`, function* () {
      escherStub.authenticate.throws(new Error('test message'));
      var context = createContextWithEmptyBody();

      yield callMiddleware(context);

      expect(context.throw).to.have.been.calledWith(401, 'test message');
    });


    it(`should yield the "next" if there were no problem on authentication`, function* () {
      var yieldCalled = false;

      /*eslint-disable*/
      yield getMiddleware(escherConfig).call(createContextWithEmptyBody(), function* () {
        yieldCalled = true;
      });

      expect(yieldCalled).to.be.true;
      /*eslint-enable*/
    });

  });

});
