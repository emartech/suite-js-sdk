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
var FieldAPI = require('./endpoints/field');
var SegmentAPI = require('./endpoints/segment');
var PurchaseAPI = require('./endpoints/purchase');
var KeyPool = require('escher-keypool');
var _ = require('lodash');

var config = require('../config');

var SuiteAPI = function(options) {
  options = this._mergeWithDefaultOptions(options);
  this._apiRequest = ApiRequest.create(options);

  this.administrator = AdministratorAPI.create(this._apiRequest, options);
  this.contact = ContactAPI.create(this._apiRequest, options);
  this.contactList = ContactListAPI.create(this._apiRequest, options);
  this.email = EmailAPI.create(this._apiRequest, options);
  this.field = FieldAPI.create(this._apiRequest, options);
  this.segment = SegmentAPI.create(this._apiRequest, options);
  this.language = LanguageAPI.create(this._apiRequest, options);
  this.externalEvent = ExternalEventAPI.create(this._apiRequest, options);
  this.settings = SettingsAPI.create(this._apiRequest, options);
  this.purchase = PurchaseAPI.create(this._apiRequest, options);

  this.environment = options.environment;
};


SuiteAPI.prototype = {

  setCache: function(cacheId) {
    this._apiRequest.setCache(cacheId);
  },


  _mergeWithDefaultOptions: function(options) {
    return _.extend({}, this._apiKeySecret(), {
      environment: config.suiteApi.environment || config.API_PROXY_URL,
      rejectUnauthorized: config.suiteApi.rejectUnauthorized,
      secure: config.suiteApi.secure
    }, options);
  },


  _apiKeySecret: function() {
    var apiKey = config.suiteApi.apiKey;
    var apiSecret = config.suiteApi.apiSecret;

    if (apiSecret && apiKey) return { apiKey: apiKey, apiSecret: apiSecret };
    if (config.suiteApi.keyPool) return this._apiKeySecretFromKeyPool();

    return { apiKey: undefined, apiSecret: undefined };
  },


  _apiKeySecretFromKeyPool: function() {
    var fromKeyPool = new KeyPool(config.suiteApi.keyPool).getActiveKey(config.suiteApi.keyId);

    return {
      apiKey: fromKeyPool.keyId,
      apiSecret: fromKeyPool.secret
    };
  }


};


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
module.exports.Field = FieldAPI;
module.exports.Segment = SegmentAPI;
module.exports.SuiteRequestError = SuiteRequest.Error;
