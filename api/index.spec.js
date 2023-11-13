'use strict';

const { EscherRequest, EscherRequestOption } = require('@emartech/escher-request');
var SuiteAPI = require('./');

var AdministratorAPI = require('./endpoints/administrator');
var AutomationCenterAPI = require('./endpoints/automationcenter');
var CampaignAPI = require('./endpoints/campaign');
var CombinedSegmentAPI = require('./endpoints/combinedsegment');
var ConditionAPI = require('./endpoints/condition');
var ContactAPI = require('./endpoints/contact');
var ContactListAPI = require('./endpoints/contactlist');
var EmailAPI = require('./endpoints/email');
var ExportAPI = require('./endpoints/export');
var ExternalEventAPI = require('./endpoints/externalevent');
var FieldAPI = require('./endpoints/field');
var FormAPI = require('./endpoints/form');
var LanguageAPI = require('./endpoints/language');
var PurchaseAPI = require('./endpoints/purchase');
var SegmentAPI = require('./endpoints/segment');
var SettingsAPI = require('./endpoints/settings');
var KeyringAPI = require('./endpoints/keyring');

var Request = require('./../lib/api-request');

var config = require('../config');

describe('SuiteApi', function() {


  describe('#create', function() {
    var stubRequestCreation;

    beforeEach(function() {
      stubRequestCreation = (function() {
        sinon.stub(EscherRequest, 'create');
        sinon.stub(Request, 'create');
        sinon.stub(EscherRequestOption, 'createForInternalApi').returns('SuiteRequestOptionsStub');
        sinon.stub(EscherRequestOption, 'createForServiceApi').returns('SuiteServiceRequestOptionsStub');
      }).bind(this);
    });


    it('should return a new instance of an API with the given environment and key data', function() {
      stubRequestCreation();
      var options = {
        environment: 'environment',
        apiKey: 'apiKey',
        apiSecret: 'apiSecret',
        rejectUnauthorized: true,
        secure: true,
        port: 443,
        timeout: 12345
      };
      SuiteAPI.create(options);
      expect(Request.create).to.have.been.calledWith(options);
    });


    describe('environment and key data is not provided', function() {

      describe('keypool provided but api key and api secret not', function() {

        it('should return a new instance with configuration from key pool', function() {
          sinon.stub(config.suiteApi, 'environment').value('environmentFromEnv');
          sinon.stub(config.suiteApi, 'rejectUnauthorized').value(false);
          sinon.stub(config.suiteApi, 'keyPool').value(JSON.stringify([{ keyId: 'suite_ums_v1', secret: '<Y>', acceptOnly: 0 }]));

          stubRequestCreation();

          SuiteAPI.create();

          expect(Request.create).to.have.been.calledWith({
            apiKey: 'suite_ums_v1',
            apiSecret: '<Y>',
            environment: 'environmentFromEnv',
            rejectUnauthorized: false,
            secure: true,
            port: 443,
            timeout: 15000
          });
        });


        it('should return a new instance with configuration from key pool for the given scope if scope environment variable exists', function() {
          sinon.stub(config.suiteApi, 'environment').value('environmentFromEnv');
          sinon.stub(config.suiteApi, 'rejectUnauthorized').value(false);
          sinon.stub(config.suiteApi, 'keyPool').value(JSON.stringify([
            { keyId: 'suite_ums_v1', secret: '<Y>', acceptOnly: 0 },
            { keyId: 'suite_noc_v1', secret: '<Y>', acceptOnly: 0 }
          ]));
          sinon.stub(config.suiteApi, 'keyId').value('suite_noc');

          stubRequestCreation();

          SuiteAPI.create();

          expect(Request.create).to.have.been.calledWith({
            apiKey: 'suite_noc_v1',
            apiSecret: '<Y>',
            environment: 'environmentFromEnv',
            rejectUnauthorized: false,
            secure: true,
            port: 443,
            timeout: 15000
          });
        });

      });
    });

    describe('environment and key data is provided', function() {

      it('should return a new instance with configuration from env variables', function() {
        sinon.stub(config.suiteApi, 'environment').value('environmentFromEnv');
        sinon.stub(config.suiteApi, 'rejectUnauthorized').value(false);
        sinon.stub(config.suiteApi, 'apiKey').value('apiKeyFromEnv');
        sinon.stub(config.suiteApi, 'apiSecret').value('apiSecretFromEnv');
        sinon.stub(config.suiteApi, 'secure').value(false);
        sinon.stub(config.suiteApi, 'timeout').value(13500);

        stubRequestCreation();

        var api = SuiteAPI.create();

        expect(Request.create).to.have.been.calledWith({
          apiKey: 'apiKeyFromEnv',
          apiSecret: 'apiSecretFromEnv',
          environment: 'environmentFromEnv',
          rejectUnauthorized: false,
          secure: false,
          port: 443,
          timeout: 13500
        });

        /*eslint-disable*/
        expect(api).to.be.ok;
        /*eslint-enable*/
      });

    });

    describe('environment is not provided from any source', function() {

      it('should return a new instance with API proxy', function() {
        sinon.stub(config.suiteApi, 'apiKey').value('apiKeyFromEnv');
        sinon.stub(config.suiteApi, 'apiSecret').value('apiSecretFromEnv');

        stubRequestCreation();

        SuiteAPI.create();

        expect(Request.create).to.have.been.calledWith({
          apiKey: 'apiKeyFromEnv',
          apiSecret: 'apiSecretFromEnv',
          environment: 'api.emarsys.net',
          rejectUnauthorized: true,
          secure: true,
          port: 443,
          timeout: 15000
        });
      });

    });

  });



  describe('endpoints', function() {

    var fakeRequest;
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
        rejectUnauthorized: false,
        secure: true,
        port: 443,
        timeout: 15000
      };

      sinon.stub(AdministratorAPI, 'create').returns('FromAdministratorEndpointStub');
      sinon.stub(AutomationCenterAPI, 'create').returns('FromAutomationCenterEndpointStub');
      sinon.stub(CampaignAPI, 'create').returns('FromCampaignEndpointStub');
      sinon.stub(CombinedSegmentAPI, 'create').returns('FromCombinedSegmentEndpointStub');
      sinon.stub(ConditionAPI, 'create').returns('FromConditionEndpointStub');
      sinon.stub(ContactAPI, 'create').returns('FromContactEndpointStub');
      sinon.stub(ContactListAPI, 'create').returns('FromContactListEndpointStub');
      sinon.stub(EmailAPI, 'create').returns('FromEmailEndpointStub');
      sinon.stub(ExportAPI, 'create').returns('FromExportEndpointStub');
      sinon.stub(ExternalEventAPI, 'create').returns('FromExternalEventEndpointStub');
      sinon.stub(FieldAPI, 'create').returns('FromFieldEndpointStub');
      sinon.stub(FormAPI, 'create').returns('FromFormEndpointStub');
      sinon.stub(LanguageAPI, 'create').returns('FromLanguageEndpointStub');
      sinon.stub(PurchaseAPI, 'create').returns('FromPurchaseEndpointStub');
      sinon.stub(SegmentAPI, 'create').returns('FromSegmentEndpointStub');
      sinon.stub(SettingsAPI, 'create').returns('FromSettingsEndpointStub');
      sinon.stub(KeyringAPI, 'create').returns('FromKeyringEndpointStub');

      var suiteRequestStub = sinon.stub(EscherRequest, 'create');
      suiteRequestStub.withArgs(apiKey, apiSecret, 'SuiteRequestOptionsStub').returns('SuiteRequestStub');
      suiteRequestStub.withArgs(apiKey, apiSecret, 'SuiteServiceRequestOptionsStub').returns('SuiteServiceRequestStub');
      fakeRequest = { id: 'fakeRequestFrom' };
      sinon.stub(Request, 'create').withArgs(options).returns(fakeRequest);
      sdk = SuiteAPI.create(options);
    });


    var testCases = [
      {
        endpoint: 'Administrator',
        sdkKey: 'administrator',
        api: AdministratorAPI,
        stub: 'FromAdministratorEndpointStub'
      },
      {
        endpoint: 'AutomationCenter',
        sdkKey: 'automationCenter',
        api: AutomationCenterAPI,
        stub: 'FromAutomationCenterEndpointStub'
      },
      {
        endpoint: 'Campaign',
        sdkKey: 'campaign',
        api: CampaignAPI,
        stub: 'FromCampaignEndpointStub'
      },
      {
        endpoint: 'CombinedSegment',
        sdkKey: 'combinedSegment',
        api: CombinedSegmentAPI,
        stub: 'FromCombinedSegmentEndpointStub'
      },
      {
        endpoint: 'Condition',
        sdkKey: 'condition',
        api: ConditionAPI,
        stub: 'FromConditionEndpointStub'
      },
      {
        endpoint: 'Contact',
        sdkKey: 'contact',
        api: ContactAPI,
        stub: 'FromContactEndpointStub'
      },
      {
        endpoint: 'ContactList',
        sdkKey: 'contactList',
        api: ContactListAPI,
        stub: 'FromContactListEndpointStub'
      },
      {
        endpoint: 'Email',
        sdkKey: 'email',
        api: EmailAPI,
        stub: 'FromEmailEndpointStub'
      },
      {
        endpoint: 'Export',
        sdkKey: 'export',
        api: ExportAPI,
        stub: 'FromExportEndpointStub'
      },
      {
        endpoint: 'ExternalEvent',
        sdkKey: 'externalEvent',
        api: ExternalEventAPI,
        stub: 'FromExternalEventEndpointStub'
      },
      {
        endpoint: 'Field',
        sdkKey: 'field',
        api: FieldAPI,
        stub: 'FromFieldEndpointStub'
      },
      {
        endpoint: 'Form',
        sdkKey: 'form',
        api: FormAPI,
        stub: 'FromFormEndpointStub'
      },
      {
        endpoint: 'Language',
        sdkKey: 'language',
        api: LanguageAPI,
        stub: 'FromLanguageEndpointStub'
      },
      {
        endpoint: 'Purchase',
        sdkKey: 'purchase',
        api: PurchaseAPI,
        stub: 'FromPurchaseEndpointStub'
      },
      {
        endpoint: 'Segment',
        sdkKey: 'segment',
        api: SegmentAPI,
        stub: 'FromSegmentEndpointStub'
      },
      {
        endpoint: 'Settings',
        sdkKey: 'settings',
        api: SettingsAPI,
        stub: 'FromSettingsEndpointStub'
      },
      {
        endpoint: 'Keyring',
        sdkKey: 'keyring',
        api: KeyringAPI,
        stub: 'FromKeyringEndpointStub'
      }
    ];

    testCases.forEach(function(testCase) {
      it('should have an SDK object with ' + testCase.endpoint + ' endpoint', function() {
        expect(sdk[testCase.sdkKey]).to.eql(testCase.stub);
      });

      it('should have been called with fake request when creating api.' + testCase.sdkKey, function() {
        expect(testCase.api.create).to.have.been.calledWith(fakeRequest, options);
      });
    });

  });

});
