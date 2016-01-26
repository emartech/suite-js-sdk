'use strict';

var getMiddleware = require('./koa-authenticator').getMiddleware;
var expect = require('chai').expect;
var sinon = require('sinon');


describe('Koa Escher Request Authenticator Middleware', function() {
  var next;

  var callMiddleware = function(context) {
    return getMiddleware().call(context, next);
  };

  var createContext = function(authPromise) {
    return {
      authenticateEscher: authPromise,
      throw: sinon.stub()
    };
  };

  beforeEach(function() {
    /*eslint-disable*/
    next = function* () {};
    /*eslint-enable*/
  });

  it('should throw HTTP 401 if context is invalid', function*() {
    var context = createContext();

    yield callMiddleware(context);

    expect(context.throw).to.have.been.calledWith(401, sinon.match.any);
  });

  it('should throw HTTP 401 in case of authentication problem', function*() {
    var rejectedAuthentication = Promise.reject(new Error('Test escher error'));
    var context = createContext(rejectedAuthentication);

    yield callMiddleware(context);

    expect(context.throw).to.have.been.calledWith(401, 'Test escher error');
  });

  it('should yield the "next" if there were no problem on authentication', function*() {
    var resolvedAuthentication = Promise.resolve('test_escher_keyid');
    var context = createContext(resolvedAuthentication);

    var nextCalled = false;

    /*eslint-disable*/
    next = function*() {
      nextCalled = true;
    };
    /*eslint-enable*/

    yield callMiddleware(context);

    expect(nextCalled).to.eql(true);
  });
});
