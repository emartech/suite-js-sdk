'use strict';

var SuiteRequest = require('escher-suiteapi-js');
var ApiRequest = require('./../lib/api-request');
var AdministratorAPI = require('./endpoints/administrator');
var ContactAPI = require('./endpoints/contact');
var ContactListAPI = require('./endpoints/contactlist');
var LanguageAPI = require('./endpoints/language');
var ExternalEventAPI = require('./endpoints/externalevent');
var SettingsAPI = require('./endpoints/settings');
var EmailAPI = require('./endpoints/email');
var SegmentAPI = require('./endpoints/segment');
var PurchaseAPI = require('./endpoints/purchase');
var KeyPool = require('escher-keypool');
var _ = require('lodash');


var SuiteAPI = function(options) {
  options = this._mergeWithDefaultOptions(options);
  this._internalApirequest = this._createInternalApiRequest(options);

  this.administrator = AdministratorAPI.create(this._internalApirequest, options);
  this.contact = ContactAPI.create(this._internalApirequest, options);
  this.contactList = ContactListAPI.create(this._internalApirequest, options);
  this.email = EmailAPI.create(this._internalApirequest, options);
  this.segment = SegmentAPI.create(this._internalApirequest, options);
  this.language = LanguageAPI.create(this._internalApirequest, options);
  this.externalEvent = ExternalEventAPI.create(this._internalApirequest, options);
  this.settings = SettingsAPI.create(this._internalApirequest, options);
  this.purchase = PurchaseAPI.create(this._internalApirequest, options);

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
    return ApiRequest.create(options);
  },

  _apiKeySecret: function() {
    var apiKey = process.env.SUITE_API_KEY;
    var apiSecret = process.env.SUITE_API_SECRET;

    if (apiSecret && apiKey) return { apiKey: apiKey, apiSecret: apiSecret };
    if (process.env.KEY_POOL) return this._apiKeySecretFromKeyPool();

    return { apiKey: undefined, apiSecret: undefined };
  },


  _apiKeySecretFromKeyPool: function() {
    var fromKeyPool = new KeyPool(process.env.KEY_POOL).getActiveKey(process.env.SUITE_API_KEY_ID);

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
module.exports.Purchase = PurchaseAPI;
module.exports.Email = EmailAPI;
module.exports.Segment = SegmentAPI;
module.exports.SuiteRequestError = SuiteRequest.Error;
