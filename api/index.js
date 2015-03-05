'use strict';

var SuiteRequest = require('escher-suiteapi-js');
var SuiteRequestOptions = SuiteRequest.Options;
var Request = require('./../lib/request/index');
var AdministratorAPI = require('./endpoints/administrator/index');
var ContactAPI = require('./endpoints/contact/index');
var LanguageAPI = require('./endpoints/language/index');
var ExternalEventAPI = require('./endpoints/externalevent/index');
var SettingsAPI = require('./endpoints/settings/index');
var _ = require('lodash');


var SuiteAPI = function(options) {
  options = this._mergeWithDefaultOptions(options);
  this._request = this._createRequest(options);
  this.administrator = AdministratorAPI.create(this._request);
  this.contact = ContactAPI.create(this._request);
  this.language = LanguageAPI.create(this._request);
  this.externalEvent = ExternalEventAPI.create(this._request);
  this.settings = SettingsAPI.create(this._request);
  this.environment = options.environment;
};


SuiteAPI.prototype = {

  setCache: function(cacheId) {
    this._request.setCache(cacheId);
  },


  _mergeWithDefaultOptions: function(options) {
    return _.extend({}, {
      environment: process.env.SUITE_API_ENVIRONMENT || SuiteAPI.API_PROXY_URL,
      apiKey: process.env.SUITE_API_KEY,
      apiSecret: process.env.SUITE_API_SECRET,
      rejectUnauthorized: process.env.SUITE_API_REJECT_UNAUTHORIZED !== 'false'
    }, options);
  },


  _createRequest: function(options) {
    var requestOptions = SuiteRequestOptions.getSecureFor(options.environment, options.rejectUnauthorized);
    var suiteRequest = SuiteRequest.create(options.apiKey, options.apiSecret, requestOptions);
    return Request.create(suiteRequest);
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
module.exports.Language = LanguageAPI;
module.exports.ExternalEvent = ExternalEventAPI;
module.exports.Settings = SettingsAPI;
module.exports.SuiteRequestError = SuiteRequest.Error;
