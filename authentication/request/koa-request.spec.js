'use strict';

var Escher = require('escher-auth');
var koaApp = require('koa');
var request = require('supertest');
var getInterceptorMiddleware = require('./koa-interceptor').getMiddleware;
var getAuthenticatorMiddleware = require('./koa-authenticator').getMiddleware;

describe('Koa Escher Authentication Middleware suite', function() {
  var app;
  var escherStub;

  beforeEach(function() {
    escherStub = {
      authenticate: this.sandbox.stub()
    };

    this.sandbox.stub(Escher, 'create').returns(escherStub);

    app = koaApp();
    app.use(getInterceptorMiddleware({ credentialScope: 'testScope' }));
    app.use(getAuthenticatorMiddleware());
  });

  it('should return with HTTP 401 in case of authentication error', function(done) {
    escherStub.authenticate.throws(new Error('Test escher error'));

    request(app.listen())
      .post('/')
      .send('{"foo": "bar"}')
      .expect(401, 'Test escher error', done);
  });

  it('should run controller if request is a valid escher request', function(done) {
    escherStub.authenticate.returns('test_escher_keyid');

    /*eslint-disable*/
    app.use(function*() {
      this.body = 'test message from controller';
    });
    /*eslint-enable*/

    request(app.listen())
      .post('/')
      .send('{"foo": "bar"}')
      .expect(200, 'test message from controller', done);
  });

});
