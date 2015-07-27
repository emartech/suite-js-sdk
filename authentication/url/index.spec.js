'use strict';

var expect = require('chai').expect;
var _ = require('lodash');
var sinon = require('sinon');
var Escher = require('escher-auth');
var SuiteSignedUrlAuthenticator = require('./');
var KeyPool = require('escher-keypool');


describe('Suite API authentication', function() {

  var fakeEscher;

  beforeEach(function() {
    fakeEscher = { authenticate: sinon.stub() };
    this.sandbox.stub(Escher, 'create').returns(fakeEscher);
  });


  it('should authenticate through escher with request', function() {
    var suiteSignedUrlAuthenticator = new SuiteSignedUrlAuthenticator({
      credentialScope: 'testCredentialScope',
      escherSecret: 'testEscherSecret'
    });

    suiteSignedUrlAuthenticator.authenticate('testUrl', 'testHost');

    expect(Escher.create).to.have.been.calledWith({
      credentialScope: 'testCredentialScope',
      vendorKey: 'EMS',
      algoPrefix: 'EMS'
    });

    expect(fakeEscher.authenticate).to.have.been.calledWith({
      method: 'GET',
      url: 'testUrl',
      headers: [
        ['Host', 'testHost']
      ]
    });
  });


  it('should authenticate through escher with keyDb', function() {
    var suiteSignedUrlAuthenticator = new SuiteSignedUrlAuthenticator({
      credentialScope: 'testCredentialScope',
      escherSecret: 'testEscherSecret'
    });

    suiteSignedUrlAuthenticator.authenticate('testUrl', 'testHost');

    expect(fakeEscher.authenticate.lastCall.args[1]()).to.eql('testEscherSecret');
  });


  it('should thrown an error if escher auth fails', function(done) {
    fakeEscher.authenticate.throws(new Error('The credential scope is invalid'));

    var suiteSignedUrlAuthenticator = new SuiteSignedUrlAuthenticator({
      credentialScope: 'testCredentialScope',
      escherSecret: 'testEscherSecret'
    });

    var err = new Error('Escher authentication');
    err.reason = 'The credential scope is invalid';

    try {
      suiteSignedUrlAuthenticator.authenticate('testUrl', 'testHost');
    } catch (ex) {
      expect(ex).to.eql(err);
      done();
    }
  });


  describe('without options', function() {

    beforeEach(function() {
      process.env.SUITE_ESCHER_CREDENTIAL_SCOPE = 'testEscherCredentialScoperFromEnv';
    });

    afterEach(function() {
      delete process.env.SUITE_ESCHER_CREDENTIAL_SCOPE;
    });


    describe('with key pool environment variable', function() {

      var keyId;

      beforeEach(function() {
        keyId = 'suite_user-management_v1';
        process.env.KEY_POOL = '[{"keyId":"' + keyId + '","secret":"MMQLFS9JpUj3MoGdDn9I0WsjLImPIkR9","acceptOnly":0}]';
      });

      afterEach(function() {
        delete process.env.KEY_POOL;
      });

      it('should use secret from key pool', function() {
        var suiteSignedUrlAuthenticator = new SuiteSignedUrlAuthenticator();
        suiteSignedUrlAuthenticator.authenticate('testUrl', 'testHost');

        var keydbFromKeypool = new KeyPool(process.env.KEY_POOL).getKeyDb();
        expect(fakeEscher.authenticate.lastCall.args[1](keyId)).to.eql(keydbFromKeypool(keyId));
      });


      it('should use credential scope from environment variable', function() {
        var suiteSignedUrlAuthenticator = new SuiteSignedUrlAuthenticator();

        suiteSignedUrlAuthenticator.authenticate('testUrl', 'testHost');

        expect(Escher.create).to.have.been.calledWith({
          credentialScope: 'testEscherCredentialScoperFromEnv',
          vendorKey: 'EMS',
          algoPrefix: 'EMS'
        });
      });

    });


    describe('with suite escher secret environment variable', function() {

      beforeEach(function() {
        process.env.SUITE_ESCHER_SECRET = 'testEscherSecretFromEnv';
      });

      afterEach(function() {
        delete process.env.SUITE_ESCHER_SECRET;
      });

      it('should use secret from environment variable', function() {
        var suiteSignedUrlAuthenticator = new SuiteSignedUrlAuthenticator();

        suiteSignedUrlAuthenticator.authenticate('testUrl', 'testHost');

        expect(fakeEscher.authenticate.lastCall.args[1]()).to.eql('testEscherSecretFromEnv');
      });


      it('should use credential scope from environment variable', function() {
        var suiteSignedUrlAuthenticator = new SuiteSignedUrlAuthenticator();

        suiteSignedUrlAuthenticator.authenticate('testUrl', 'testHost');

        expect(Escher.create).to.have.been.calledWith({
          credentialScope: 'testEscherCredentialScoperFromEnv',
          vendorKey: 'EMS',
          algoPrefix: 'EMS'
        });
      });

    });


    describe('with escher secret and keypool environment variable', function() {

      beforeEach(function() {
        process.env.SUITE_ESCHER_SECRET = 'testEscherSecretFromEnv';
        process.env.KEY_POOL = '[{"keyId":"suite_user-management_v1","secret":"MMQLFS9JpUj3MoGdDn9I0WsjLImPIkR9","acceptOnly":0}]';
      });

      afterEach(function() {
        delete process.env.SUITE_ESCHER_SECRET;
        delete process.env.KEY_POOL;
      });

      it('should use secret from escher secret environment variable', function() {
        var suiteSignedUrlAuthenticator = new SuiteSignedUrlAuthenticator();
        suiteSignedUrlAuthenticator.authenticate('testUrl', 'testHost');
        expect(fakeEscher.authenticate.lastCall.args[1]()).to.eql('testEscherSecretFromEnv');
      });

    });


    describe('without escher secret and keypool environment variable', function() {

      it('should use an undefined secret', function() {
        var suiteSignedUrlAuthenticator = new SuiteSignedUrlAuthenticator();
        suiteSignedUrlAuthenticator.authenticate('testUrl', 'testHost');
        expect(fakeEscher.authenticate.lastCall.args[1]()).to.be.undefined;
      });

    });

  });

});
