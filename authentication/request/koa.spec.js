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

  var createContext = function(koaRequest) {
    return {
      req: { body: {} },
      request: koaRequest,
      throw: sinon.stub()
    };
  };

  var createContextWithEmptyBody = function() {
    return createContext({ body: {} });
  };

  beforeEach(function() {
    escherConfig = {
      credentialScope: 'testScope',
      keyPool: JSON.stringify([{ 'keyId': 'suite_cuda_v1', 'secret': 'testSecret', 'acceptOnly': 0 }])
    };

    // eslint-disable-next-line require-yield
    next = function* () {};
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

      // eslint-disable-next-line no-unused-expressions
      expect(escherStub.authenticate).to.have.been.called;
    });

    it('should have been called with original Node request object decorated with the stringified body from the koa\'s request object', function* () {
      var context = createContext({ body: { testData: 'testValue' } });
      yield callMiddleware(context);

      var expectedRequest = Object.create(context.req);
      expectedRequest.body = JSON.stringify(context.request.body);

      expect(escherStub.authenticate).to.have.been.calledWithExactly(expectedRequest, sinon.match.any);
    });


    it('should have been called with original Node request object decorated with the raw body from the koa\'s request object if available', function*() {
      var context = createContext({ body: { raw: 'body//' }, rawBody: '{"raw":"body\\/\\/"}' });
      yield callMiddleware(context);

      var expectedRequest = Object.create(context.req);
      expectedRequest.body = '{"raw":"body\\/\\/"}';

      expect(escherStub.authenticate).to.have.been.calledWithExactly(expectedRequest, sinon.match.any);
    });


    it('should have been called with original Node request object if the query body is empty', function* () {
      var context = createContextWithEmptyBody();
      yield callMiddleware(context);

      var expectedRequest = Object.create(context.req);
      expectedRequest.body = context.request.body;

      expect(escherStub.authenticate).to.have.been.calledWithExactly(expectedRequest, sinon.match.any);
    });

    it('should have been called with the proper keys using keypool from configuration', function* () {
      this.sandbox.stub(KeyPool, 'create').returns({
        getKeyDb: this.sandbox.stub().returns('testKey')
      });

      yield callMiddleware(createContextWithEmptyBody());

      expect(KeyPool.create).to.have.been.calledWith(escherConfig.keyPool);
      expect(escherStub.authenticate).to.have.been.calledWithExactly(sinon.match.any, 'testKey');
    });

    it('should throw an unauthorized error in the context if error happened', function* () {
      escherStub.authenticate.throws(new Error('test message'));
      var context = createContextWithEmptyBody();

      yield callMiddleware(context);

      expect(context.throw).to.have.been.calledWith(401, 'test message');
    });


    describe('when there was no problem on authentication', function() {

      it('should yield the "next"', function*() {
        var yieldCalled = false;

        // eslint-disable-next-line require-yield
        yield getMiddleware(escherConfig).call(createContextWithEmptyBody(), function*() {
          yieldCalled = true;
        });

        // eslint-disable-next-line no-unused-expressions
        expect(yieldCalled).to.be.true;
      });


      it('should reraise the error raised in the "next" unchanged', function*() {
        var nextError = new Error('Error in next');

        try {
          // eslint-disable-next-line require-yield
          yield getMiddleware(escherConfig).call(createContextWithEmptyBody(), function*() {
            throw nextError;
          });
        } catch (e) {
          expect(e).to.equal(nextError);
          return;
        }

        throw new Error('should reraise the error thrown in the "next"');
      });

    });

  });

});
