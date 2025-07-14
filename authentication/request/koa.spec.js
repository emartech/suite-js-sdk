'use strict';

var Escher = require('escher-auth');
var KeyPool = require('escher-keypool');
var getMiddleware = require('./koa').getMiddleware;

describe('Koa Escher Request Authentication Middleware', function() {
  var escherConfig;
  var next;

  var callMiddleware = function(context) {
    return getMiddleware(escherConfig)(context, next);
  };

  var createContext = function(body) {
    return {
      req: { foo: 'bar', body: {} },
      request: { rawBody: body },
      throw: sinon.stub()
    };
  };

  var createContextWithEmptyBody = function() {
    return createContext();
  };

  beforeEach(function() {
    escherConfig = {
      credentialScope: 'testScope',
      keyPool: JSON.stringify([{ 'keyId': 'suite_cuda_v1', 'secret': 'testSecret', 'acceptOnly': 0 }])
    };

    // eslint-disable-next-line require-await
    next = async function() { };
  });


  describe('Escher library', function() {

    it('should be initialized with the proper Escher config', async function() {
      var fullConfig = {
        algoPrefix: 'EMS',
        vendorKey: 'EMS',
        authHeaderName: 'X-EMS-Auth',
        dateHeaderName: 'X-EMS-Date',
        credentialScope: 'testScope'
      };

      sinon.stub(Escher, 'create');

      await callMiddleware(createContextWithEmptyBody());

      expect(Escher.create).to.have.been.calledWith(fullConfig);
    });

  });

  describe('Escher #authenticate', function() {
    var escherStub;

    beforeEach(function() {
      escherStub = {
        authenticate: sinon.stub()
      };

      sinon.stub(Escher, 'create').returns(escherStub);
    });

    it('should have been called', async function() {
      await callMiddleware(createContextWithEmptyBody());

      // eslint-disable-next-line no-unused-expressions
      expect(escherStub.authenticate).to.have.been.called;
    });

    it('should have been called with original Node request object decorated with the raw body from the koa\'s request object', async function() {
      var rawBody = '{"testData":"testValue"}';
      var context = createContext(rawBody);
      await callMiddleware(context);

      var expectedRequest = Object.assign({}, context.req);
      expectedRequest.body = rawBody;

      expect(escherStub.authenticate).to.have.been.calledWithExactly(expectedRequest, sinon.match.any);
    });


    it('should have been called with original Node request object if the query body is empty', async function() {
      var context = createContextWithEmptyBody();
      await callMiddleware(context);

      var expectedRequest = Object.assign({}, context.req);

      expect(escherStub.authenticate).to.have.been.calledWithExactly(expectedRequest, sinon.match.any);
    });

    it('should have been called with the proper keys using keypool from configuration', async function() {
      sinon.stub(KeyPool, 'create').returns({
        getKeyDb: sinon.stub().returns('testKey')
      });

      await callMiddleware(createContextWithEmptyBody());

      expect(KeyPool.create).to.have.been.calledWith(escherConfig.keyPool);
      expect(escherStub.authenticate).to.have.been.calledWithExactly(sinon.match.any, 'testKey');
    });

    it('should throw an unauthorized error in the context if error happened', async function() {
      escherStub.authenticate.throws(new Error('test message'));
      var context = createContextWithEmptyBody();

      await callMiddleware(context);

      expect(context.throw).to.have.been.calledWith(401, 'test message');
    });


    describe('when there was no problem on authentication', function() {

      it('should await the "next"', async function() {
        var awaitCalled = false;

        // eslint-disable-next-line require-await
        await getMiddleware(escherConfig)(createContextWithEmptyBody(), async function() {
          awaitCalled = true;
        });

        // eslint-disable-next-line no-unused-expressions
        expect(awaitCalled).to.be.true;
      });

      it('should reraise the error raised in the async "next" unchanged', async function() {
        var nextError = new Error('Error in next');

        try {
          // eslint-disable-next-line require-await
          await getMiddleware(escherConfig)(createContextWithEmptyBody(), async function() {
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
