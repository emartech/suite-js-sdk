'use strict';

var expect = require('chai').expect;
var Escher = require('escher-auth');
var getMiddleware = require('./koa-interceptor').getMiddleware;
var KeyPool = require('escher-keypool');
var sinon = require('sinon');
var ReadableStream = require('stream').Readable;


describe('Koa Escher Request Interceptor Middleware', function() {
  var escherConfig;
  var next;
  var requestBodyStream;
  var requestBody;

  var callMiddleware = function(context) {
    return getMiddleware(escherConfig).call(context, next);
  };

  var callPromise = function(context) {
    return context.authenticateEscher;
  };

  var callMiddlewareAndPromise = function*(context) {
    yield callMiddleware(context);
    yield callPromise(context);
  };

  var createContextWithRequestBody = function() {
    requestBodyStream.push(requestBody);
    requestBodyStream.push(null);

    return {
      req: requestBodyStream,
      request: {}
    };
  };

  beforeEach(function() {
    escherConfig = {
      credentialScope: 'testScope',
      keyPool: JSON.stringify([{ 'keyId': 'suite_cuda_v1', 'secret': 'testSecret', 'acceptOnly': 0 }])
    };

    /*eslint-disable*/
    next = function* () {};
    /*eslint-enable*/

    requestBodyStream = new ReadableStream();
    requestBody = '    {"test":"json"}    ';
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

      yield callMiddleware({});

      expect(Escher.create).to.have.been.calledWith(fullConfig);
    });

  });

  describe('Promise', function() {
    var escherStub;

    beforeEach(function() {
      escherStub = {
        authenticate: this.sandbox.stub()
      };

      this.sandbox.stub(Escher, 'create').returns(escherStub);
    });

    it('should be placed onto the context', function* () {
      var context = {};

      yield callMiddleware(context);

      expect(callPromise(context)).to.be.instanceOf(Promise);
    });

    it('should resolve when the data read from request stream', function*(done) {
      // arrange
      var context = createContextWithRequestBody();

      // assert
      requestBodyStream.on('end', function() {
        callPromise(context)
          .then(() => done())
          .catch((ex) => done(ex));
      });

      // act
      yield callMiddleware(context);
    });

    it('should supply the request data to escher without modification', function*() {
      var context = createContextWithRequestBody();

      yield callMiddlewareAndPromise(context);

      var expectedRequest = Object.create(context.request);
      expectedRequest.body = requestBody;

      expect(escherStub.authenticate).to.have.been.calledWithExactly(expectedRequest, sinon.match.any);
    });

    it('should bubble up escher errors', function*() {
      var context = createContextWithRequestBody();
      var exception = new Error('Test escher error');
      escherStub.authenticate.throws(exception);

      yield callMiddleware(context);
      return expect(callPromise(context)).to.be.rejectedWith(exception);
    });

    it('should use the proper keys using keypool from configuration', function* () {
      this.sandbox.stub(KeyPool, 'create').returns({
        getKeyDb: this.sandbox.stub().returns('testKey')
      });

      var context = createContextWithRequestBody();

      yield callMiddlewareAndPromise(context);

      expect(KeyPool.create).to.have.been.calledWith(escherConfig.keyPool);
      expect(escherStub.authenticate).to.have.been.calledWithExactly(sinon.match.any, 'testKey');
    });
  });
});
