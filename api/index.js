'use strict';

var SuiteRequest = require('escher-suiteapi-js');
var SuiteRequestOptions = SuiteRequest.Options;
var ApiRequest = require('./../lib/api-request');
var InternalApiRequest = require('./../lib/internal-api-request');
var AdministratorAPI = require('./endpoints/administrator');
var ContactAPI = require('./endpoints/contact');
var ContactListAPI = require('./endpoints/contactlist');
var LanguageAPI = require('./endpoints/language');
var ExternalEventAPI = require('./endpoints/externalevent');
var SettingsAPI = require('./endpoints/settings');
var FlipperAPI = require('./endpoints/flipper');
var EmailAPI = require('./endpoints/email');
var SegmentAPI = require('./endpoints/segment');
var KeyPool = require('../lib/key-pool');
var _ = require('lodash');


var SuiteAPI = function(options) {
  options = this._mergeWithDefaultOptions(options);
  this._internalApirequest = this._createInternalApiRequest(options);
  this._serviceApiRequest = this._createServiceApiRequest(options);

  this.administrator = AdministratorAPI.create(this._internalApirequest);
  this.contact = ContactAPI.create(this._internalApirequest);
  this.contactList = ContactListAPI.create(this._internalApirequest);
  this.email = EmailAPI.create(this._internalApirequest);
  this.segment = SegmentAPI.create(this._internalApirequest);
  this.language = LanguageAPI.create(this._internalApirequest);
  this.externalEvent = ExternalEventAPI.create(this._internalApirequest);
  this.settings = SettingsAPI.create(this._internalApirequest);
  this.flipper = FlipperAPI.create(this._serviceApiRequest);

  this.environment = options.environment;
};


SuiteAPI.prototype = {

  setCache: function(cacheId) {
    this._internalApirequest.setCache(cacheId);
  },


  _mergeWithDefaultOptions: function(options) {
    return _.extend({}, this._apiKeySecret(), {
      environment: process.env.SUITE_API_ENVIRONMENT || SuiteAPI.API_PROXY_URL,
      rejectUnauthorized: process.env.SUITE_API_REJECT_UNAUTHORIZED !== 'false'
    }, options);
  },


  _createInternalApiRequest: function(options) {
    var requestOptions = SuiteRequestOptions.createForInternalApi(options.environment, options.rejectUnauthorized);
    var suiteRequest = SuiteRequest.create(options.apiKey, options.apiSecret, requestOptions);
    return InternalApiRequest.create(suiteRequest);
  },


  _createServiceApiRequest: function(options) {
    var requestOptions = SuiteRequestOptions.createForServiceApi(options.environment, options.rejectUnauthorized);
    var suiteRequest = SuiteRequest.create(options.apiKey, options.apiSecret, requestOptions);
    return ApiRequest.create(suiteRequest);
  },


  _apiKeySecret: function() {
    var apiKey = process.env.SUITE_API_KEY;
    var apiSecret = process.env.SUITE_API_SECRET;

    if (apiSecret && apiKey) return { apiKey: apiKey, apiSecret: apiSecret };
    if (process.env.KEY_POOL) return this._apiKeySecretFromKeyPool();

    return { apiKey: undefined, apiSecret: undefined };
  },


  _apiKeySecretFromKeyPool: function() {
    var fromKeyPool = new KeyPool(process.env.KEY_POOL).getActiveKey(process.env.SUITE_API_CREDENTIAL_SCOPE);

    return {
      apiKey: fromKeyPool.keyId,
      apiSecret: fromKeyPool.secret
    };
  }


};


SuiteAPI.API_PROXY_URL = 'api.emarsys.net';


SuiteAPI.create = function(options) {
  return new SuiteAPI(options);
};


SuiteAPI.createWithCache = function(cacheId, options) {
  var api = SuiteAPI.create(options);
  api.setCache(cacheId);
  return api;
};



module.exports = SuiteAPI;
module.exports.Administrator = AdministratorAPI;
module.exports.Contact = ContactAPI;
module.exports.ContactList = ContactListAPI;
module.exports.Language = LanguageAPI;
module.exports.ExternalEvent = ExternalEventAPI;
module.exports.Settings = SettingsAPI;
module.exports.Flipper = FlipperAPI;
module.exports.Email = EmailAPI;
module.exports.Segment = SegmentAPI;
module.exports.SuiteRequestError = SuiteRequest.Error;
