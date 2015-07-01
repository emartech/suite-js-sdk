var SuiteRequest = require('escher-suiteapi-js');
var SuiteAPI = require('./');
var AdministratorAPI = require('./endpoints/administrator');
var ContactAPI = require('./endpoints/contact');
var EmailAPI = require('./endpoints/email');
var SegmentAPI = require('./endpoints/segment');
var LanguageAPI = require('./endpoints/language');
var ExternalEventAPI = require('./endpoints/externalevent');
var SettingsAPI = require('./endpoints/settings');
var Request = require('./../lib/internal-api-request');
var ServiceRequest = require('./../lib/api-request');
var expect = require('chai').expect;
var SuiteRequestOptions = SuiteRequest.Options;

describe('SuiteApi', function() {


  describe('#create', function() {
    var stubRequestCreation;

    beforeEach(function() {
      stubRequestCreation = (function() {
        this.sandbox.stub(SuiteRequest, 'create');
        this.sandbox.stub(Request, 'create');
        this.sandbox.stub(SuiteRequestOptions, 'createForInternalApi').returns('SuiteRequestOptionsStub');
        this.sandbox.stub(SuiteRequestOptions, 'createForServiceApi').returns('SuiteServiceRequestOptionsStub');
      }).bind(this);
    });

    afterEach(function() {
      delete process.env.SUITE_API_ENVIRONMENT;
      delete process.env.SUITE_API_KEY;
      delete process.env.SUITE_API_SECRET;
      delete process.env.SUITE_API_REJECT_UNAUTHORIZED;
      delete process.env.KEY_POOL;
      delete process.env.SUITE_API_KEY_ID;
    });


    it('should return a new instance of an API with the given environment and key data', function() {
      stubRequestCreation();
      var options = { environment: 'environment', apiKey: 'apiKey', apiSecret: 'apiSecret', rejectUnauthorized: true };
      SuiteAPI.create(options);
      expect(Request.create).to.have.been.calledWith(options);
    });


    describe('environment and key data is not provided', function() {

      describe('keypool provided but api key and api secret not', function() {

        it('should return a new instance with configuration from key pool', function() {
          process.env.SUITE_API_ENVIRONMENT = 'environmentFromEnv';
          process.env.SUITE_API_REJECT_UNAUTHORIZED = 'false';
          process.env.KEY_POOL = JSON.stringify([{ keyId: 'suite_ums_v1', secret: '<Y>', acceptOnly: 0 }]);

          stubRequestCreation();

          SuiteAPI.create();

          expect(Request.create).to.have.been.calledWith({
            apiKey: 'suite_ums_v1',
            apiSecret: '<Y>',
            environment: 'environmentFromEnv',
            rejectUnauthorized: false
          });
        });


        it('should return a new instance with configuration from key pool for the given scope if scope environment variable exists', function() {
          process.env.SUITE_API_ENVIRONMENT = 'environmentFromEnv';
          process.env.SUITE_API_REJECT_UNAUTHORIZED = 'false';
          process.env.SUITE_API_KEY_ID = 'suite_noc';
          process.env.KEY_POOL = JSON.stringify([
            { keyId: 'suite_ums_v1', secret: '<Y>', acceptOnly: 0 },
            { keyId: 'suite_noc_v1', secret: '<Y>', acceptOnly: 0 }
          ]);

          stubRequestCreation();

          SuiteAPI.create();

          expect(Request.create).to.have.been.calledWith({
            apiKey: 'suite_noc_v1',
            apiSecret: '<Y>',
            environment: 'environmentFromEnv',
            rejectUnauthorized: false
          });
        });

      });


      it('should return a new instance with configuration from env variables', function() {
        process.env.SUITE_API_ENVIRONMENT = 'environmentFromEnv';
        process.env.SUITE_API_KEY = 'apiKeyFromEnv';
        process.env.SUITE_API_SECRET = 'apiSecretFromEnv';
        process.env.SUITE_API_REJECT_UNAUTHORIZED = 'false';

        stubRequestCreation();

        var api = SuiteAPI.create();

        expect(Request.create).to.have.been.calledWith({
          apiKey: 'apiKeyFromEnv',
          apiSecret: 'apiSecretFromEnv',
          environment: 'environmentFromEnv',
          rejectUnauthorized: false
        });

        expect(api).to.be.ok;
      });

    });

    describe('environment is not provided from any source', function() {

      it('should return a new instance with API proxy', function() {
        process.env.SUITE_API_KEY = 'apiKeyFromEnv';
        process.env.SUITE_API_SECRET = 'apiSecretFromEnv';

        stubRequestCreation();

        SuiteAPI.create();

        expect(Request.create).to.have.been.calledWith({
          apiKey: 'apiKeyFromEnv',
          apiSecret: 'apiSecretFromEnv',
          environment: 'api.emarsys.net',
          rejectUnauthorized: true
        });
      });

    });

  });



  describe('endpoints', function() {

    var fakeRequest;
    var fakeServiceRequest;
    var sdk;
    var apiKey;
    var apiSecret;
    var environment;
    var options;

    beforeEach(function() {
      apiKey = 'apikey';
      apiSecret = 'apiSecret';
      environment = 'environment';

      options = {
        apiKey: apiKey,
        apiSecret: apiSecret,
        environment: environment,
        rejectUnauthorized: false
      };

      this.sandbox.stub(AdministratorAPI, 'create').returns('FromAdministratorEndpointStub');
      this.sandbox.stub(ContactAPI, 'create').returns('FromContactEndpointStub');
      this.sandbox.stub(EmailAPI, 'create').returns('FromEmailEndpointStub');
      this.sandbox.stub(SegmentAPI, 'create').returns('FromSegmentEndpointStub');
      this.sandbox.stub(LanguageAPI, 'create').returns('FromLanguageEndpointStub');
      this.sandbox.stub(ExternalEventAPI, 'create').returns('FromExternalEventEndpointStub');
      this.sandbox.stub(SettingsAPI, 'create').returns('FromSettingsEndpointStub');
      this.sandbox.stub(SuiteRequestOptions, 'createForInternalApi').withArgs(environment).returns('SuiteRequestOptionsStub');
      this.sandbox.stub(SuiteRequestOptions, 'createForServiceApi').withArgs(environment).returns('SuiteServiceRequestOptionsStub');
      var suiteRequestStub = this.sandbox.stub(SuiteRequest, 'create');
      suiteRequestStub.withArgs(apiKey, apiSecret, 'SuiteRequestOptionsStub').returns('SuiteRequestStub');
      suiteRequestStub.withArgs(apiKey, apiSecret, 'SuiteServiceRequestOptionsStub').returns('SuiteServiceRequestStub');
      fakeRequest = { id: 'fakeRequestFrom' };
      this.sandbox.stub(Request, 'create').withArgs(options).returns(fakeRequest);
      this.sandbox.stub(ServiceRequest, 'create').withArgs(options).returns(fakeServiceRequest);
      sdk = SuiteAPI.create(options);
    });


    it('should have an SDK object with Administrator endpoint', function() {
      expect(sdk.administrator).to.eql('FromAdministratorEndpointStub');
      expect(AdministratorAPI.create).to.have.been.calledWith(fakeRequest, options);
    });


    it('should have an SDK object with Contact endpoint', function() {
      expect(sdk.contact).to.eql('FromContactEndpointStub');
      expect(ContactAPI.create).to.have.been.calledWith(fakeRequest);
    });


    it('should have an SDK object with Segment endpoint', function() {
      expect(sdk.segment).to.eql('FromSegmentEndpointStub');
      expect(SegmentAPI.create).to.have.been.calledWith(fakeRequest);
    });


    it('should have an SDK object with Language endpoint', function() {
      expect(sdk.language).to.eql('FromLanguageEndpointStub');
      expect(LanguageAPI.create).to.have.been.calledWith(fakeRequest);
    });


    it('should have an SDK object with ExternalEvent endpoint', function() {
      expect(sdk.externalEvent).to.eql('FromExternalEventEndpointStub');
      expect(ExternalEventAPI.create).to.have.been.calledWith(fakeRequest);
    });


    it('should have an SDK object with Settings endpoint', function() {
      expect(sdk.settings).to.eql('FromSettingsEndpointStub');
      expect(SettingsAPI.create).to.have.been.calledWith(fakeRequest);
    });
    
  });



});
