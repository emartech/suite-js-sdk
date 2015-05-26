var SuiteRequest = require('escher-suiteapi-js');
var SuiteAPI = require('./');
var AdministratorAPI = require('./endpoints/administrator');
var ContactAPI = require('./endpoints/contact');
var EmailAPI = require('./endpoints/email');
var SegmentAPI = require('./endpoints/segment');
var LanguageAPI = require('./endpoints/language');
var ExternalEventAPI = require('./endpoints/externalevent');
var SettingsAPI = require('./endpoints/settings');
var FlipperAPI = require('./endpoints/flipper');
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
      delete process.env.SUITE_API_CREDENTIAL_SCOPE;
    });


    it('should return a new instance of an API with the given environment and key data', function() {
      stubRequestCreation();
      SuiteAPI.create({ environment: 'environment', apiKey: 'apiKey', apiSecret: 'apiSecret', rejectUnauthorized: true });
      expect(SuiteRequest.create).to.have.been.calledWith('apiKey', 'apiSecret', 'SuiteRequestOptionsStub');
      expect(SuiteRequest.create).to.have.been.calledWith('apiKey', 'apiSecret', 'SuiteServiceRequestOptionsStub');
      expect(SuiteRequestOptions.createForInternalApi).to.have.been.calledWith('environment', true);
      expect(SuiteRequestOptions.createForServiceApi).to.have.been.calledWith('environment', true);
    });


    describe('environment and key data is not provided', function() {

      describe('keypool provided but api key and api secret not', function() {

        it('should return a new instance with configuration from key pool', function() {
          process.env.SUITE_API_ENVIRONMENT = 'environmentFromEnv';
          process.env.SUITE_API_REJECT_UNAUTHORIZED = 'false';
          process.env.KEY_POOL = JSON.stringify([{ keyId: 'suite_ums_v1', secret: '<Y>', acceptOnly: 0 }]);

          stubRequestCreation();

          SuiteAPI.create();

          expect(SuiteRequest.create).to.have.been.calledWith('suite_ums_v1', '<Y>', 'SuiteRequestOptionsStub');
          expect(SuiteRequest.create).to.have.been.calledWith('suite_ums_v1', '<Y>', 'SuiteServiceRequestOptionsStub');
        });


        it('should return a new instance with configuration from key pool for the given scope if scope environment variable exists', function() {
          process.env.SUITE_API_ENVIRONMENT = 'environmentFromEnv';
          process.env.SUITE_API_REJECT_UNAUTHORIZED = 'false';
          process.env.SUITE_API_CREDENTIAL_SCOPE = 'suite_noc';
          process.env.KEY_POOL = JSON.stringify([
            { keyId: 'suite_ums_v1', secret: '<Y>', acceptOnly: 0 },
            { keyId: 'suite_noc_v1', secret: '<Y>', acceptOnly: 0 }
          ]);

          stubRequestCreation();

          SuiteAPI.create();

          expect(SuiteRequest.create).to.have.been.calledWith('suite_noc_v1', '<Y>', 'SuiteRequestOptionsStub');
          expect(SuiteRequest.create).to.have.been.calledWith('suite_noc_v1', '<Y>', 'SuiteServiceRequestOptionsStub');
        });

      });


      it('should return a new instance with configuration from env variables', function() {
        process.env.SUITE_API_ENVIRONMENT = 'environmentFromEnv';
        process.env.SUITE_API_KEY = 'apiKeyFromEnv';
        process.env.SUITE_API_SECRET = 'apiSecretFromEnv';
        process.env.SUITE_API_REJECT_UNAUTHORIZED = 'false';

        stubRequestCreation();

        SuiteAPI.create();

        expect(SuiteRequest.create).to.have.been.calledWith('apiKeyFromEnv', 'apiSecretFromEnv', 'SuiteRequestOptionsStub');
        expect(SuiteRequest.create).to.have.been.calledWith('apiKeyFromEnv', 'apiSecretFromEnv', 'SuiteServiceRequestOptionsStub');
        expect(SuiteRequestOptions.createForInternalApi).to.have.been.calledWith('environmentFromEnv', false);
        expect(SuiteRequestOptions.createForServiceApi).to.have.been.calledWith('environmentFromEnv', false);
      });

    });

    describe('environment is not provided from any source', function() {

      it('should return a new instance with API proxy', function() {
        process.env.SUITE_API_KEY = 'apiKeyFromEnv';
        process.env.SUITE_API_SECRET = 'apiSecretFromEnv';

        stubRequestCreation();

        SuiteAPI.create();

        expect(SuiteRequest.create).to.have.been.calledWith('apiKeyFromEnv', 'apiSecretFromEnv', 'SuiteRequestOptionsStub');
        expect(SuiteRequest.create).to.have.been.calledWith('apiKeyFromEnv', 'apiSecretFromEnv', 'SuiteServiceRequestOptionsStub');
        expect(SuiteRequestOptions.createForInternalApi).to.have.been.calledWith('api.emarsys.net', true);
        expect(SuiteRequestOptions.createForServiceApi).to.have.been.calledWith('api.emarsys.net', true);
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

    beforeEach(function() {
      apiKey = 'apikey';
      apiSecret = 'apiSecret';
      environment = 'environment';

      this.sandbox.stub(AdministratorAPI, 'create').returns('FromAdministratorEndpointStub');
      this.sandbox.stub(ContactAPI, 'create').returns('FromContactEndpointStub');
      this.sandbox.stub(EmailAPI, 'create').returns('FromEmailEndpointStub');
      this.sandbox.stub(SegmentAPI, 'create').returns('FromSegmentEndpointStub');
      this.sandbox.stub(LanguageAPI, 'create').returns('FromLanguageEndpointStub');
      this.sandbox.stub(ExternalEventAPI, 'create').returns('FromExternalEventEndpointStub');
      this.sandbox.stub(SettingsAPI, 'create').returns('FromSettingsEndpointStub');
      this.sandbox.stub(FlipperAPI, 'create').returns('FromFlipperEndpointStub');
      this.sandbox.stub(SuiteRequestOptions, 'createForInternalApi').withArgs(environment).returns('SuiteRequestOptionsStub');
      this.sandbox.stub(SuiteRequestOptions, 'createForServiceApi').withArgs(environment).returns('SuiteServiceRequestOptionsStub');
      var suiteRequestStub = this.sandbox.stub(SuiteRequest, 'create');
      suiteRequestStub.withArgs(apiKey, apiSecret, 'SuiteRequestOptionsStub').returns('SuiteRequestStub');
      suiteRequestStub.withArgs(apiKey, apiSecret, 'SuiteServiceRequestOptionsStub').returns('SuiteServiceRequestStub');
      fakeRequest = { id: 'fakeRequestFrom'};
      this.sandbox.stub(Request, 'create').withArgs('SuiteRequestStub').returns(fakeRequest);
      this.sandbox.stub(ServiceRequest, 'create').withArgs('SuiteServiceRequestStub').returns(fakeServiceRequest);
      sdk = SuiteAPI.create({ environment: environment, apiKey: apiKey, apiSecret: apiSecret });
    });


    it('should have an SDK object with Administrator endpoint', function() {
      expect(sdk.administrator).to.eql('FromAdministratorEndpointStub');
      expect(AdministratorAPI.create).to.have.been.calledWith(fakeRequest);
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


    it('should have an SDK object with Flipper endpoint', function() {
      expect(sdk.flipper).to.eql('FromFlipperEndpointStub');
      expect(FlipperAPI.create).to.have.been.calledWith(fakeServiceRequest);
    });
  });



});
