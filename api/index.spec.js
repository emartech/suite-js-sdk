var SuiteRequest = require('escher-suiteapi-js');
var SuiteAPI = require('./');
var AdministratorAPI = require('./endpoints/administrator/index');
var ContactAPI = require('./endpoints/contact/index');
var LanguageAPI = require('./endpoints/language/index');
var ExternalEventAPI = require('./endpoints/externalevent/index');
var SettingsAPI = require('./endpoints/settings/index');
var Request = require('./../lib/request/index');
var expect = require('chai').expect;
var SuiteRequestOptions = SuiteRequest.Options;

describe('SuiteApi', function() {


  describe('#create', function() {
    var stubRequestCreation;

    beforeEach(function() {
      stubRequestCreation = (function() {
        this.sandbox.stub(SuiteRequest, 'create');
        this.sandbox.stub(SuiteRequestOptions, 'getSecureFor').returns('SuiteRequestOptionsStub');
      }).bind(this);
    });

    afterEach(function() {
      delete process.env.SUITE_API_ENVIRONMENT;
      delete process.env.SUITE_API_KEY;
      delete process.env.SUITE_API_SECRET;
      delete process.env.SUITE_API_REJECT_UNAUTHORIZED;
    });


    it('should return a new instance of an API with the given environment and key data', function() {
      stubRequestCreation();
      SuiteAPI.create({ environment: 'environment', apiKey: 'apiKey', apiSecret: 'apiSecret', rejectUnauthorized: true });
      expect(SuiteRequest.create).to.have.been.calledWith('apiKey', 'apiSecret', 'SuiteRequestOptionsStub');
      expect(SuiteRequestOptions.getSecureFor).to.have.been.calledWith('environment', true);
    });


    it('should return a new instance with configuration from env variables if environment and key data is not provided', function() {
      process.env.SUITE_API_ENVIRONMENT = 'environmentFromEnv';
      process.env.SUITE_API_KEY = 'apiKeyFromEnv';
      process.env.SUITE_API_SECRET = 'apiSecretFromEnv';
      process.env.SUITE_API_REJECT_UNAUTHORIZED = 'false';

      stubRequestCreation();

      SuiteAPI.create();

      expect(SuiteRequest.create).to.have.been.calledWith('apiKeyFromEnv', 'apiSecretFromEnv', 'SuiteRequestOptionsStub');
      expect(SuiteRequestOptions.getSecureFor).to.have.been.calledWith('environmentFromEnv', false);
    });


    it('should return a new instance with API proxy if environment is not provided from any source', function() {
      process.env.SUITE_API_KEY = 'apiKeyFromEnv';
      process.env.SUITE_API_SECRET = 'apiSecretFromEnv';

      stubRequestCreation();

      SuiteAPI.create();

      expect(SuiteRequest.create).to.have.been.calledWith('apiKeyFromEnv', 'apiSecretFromEnv', 'SuiteRequestOptionsStub');
      expect(SuiteRequestOptions.getSecureFor).to.have.been.calledWith('api.emarsys.net', true);
    });


  });



  describe('endpoints', function() {

    var fakeRequest;
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
      this.sandbox.stub(LanguageAPI, 'create').returns('FromLanguageEndpointStub');
      this.sandbox.stub(ExternalEventAPI, 'create').returns('FromExternalEventEndpointStub');
      this.sandbox.stub(SettingsAPI, 'create').returns('FromSettingsEndpointStub');
      this.sandbox.stub(SuiteRequestOptions, 'getSecureFor').withArgs(environment).returns('SuiteRequestOptionsStub');
      this.sandbox.stub(SuiteRequest, 'create').withArgs(apiKey, apiSecret, 'SuiteRequestOptionsStub').returns('SuiteRequestStub');
      fakeRequest = { id: 'fakeRequestFrom'};
      this.sandbox.stub(Request, 'create').withArgs('SuiteRequestStub').returns(fakeRequest);
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
