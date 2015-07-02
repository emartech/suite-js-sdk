'use strict';

var util = require('util');
var _ = require('lodash');
var NodeCache = require('node-cache');

var SuiteRequest = require('escher-suiteapi-js');
var SuiteRequestOptions = SuiteRequest.Options;

var CACHE_TTL = 120;
var cache = new NodeCache({ stdTTL: CACHE_TTL, checkperiod: CACHE_TTL + 10 });

var InternalApiRequest = function(options) {
  this._cacheId = null;
  this.options = options;
};

_.extend(InternalApiRequest.prototype, {

  get: function(customerId, url, options) {
    var opts = this._getOptions(options);
    var response;

    var cacheKey = this._getCacheKey('get', url);

    if (this._cacheId) {
      response = cache.get(cacheKey);
      if (response[cacheKey]) {
        return Promise.resolve(response[cacheKey]);
      }
    }

    this._suiteRequest = this._createRequest(opts);

    var completeUrl = this._assembleUrl(customerId, url);
    return this._suiteRequest
      .get(completeUrl)
      .then(function(returnValue) {
        if (this._cacheId) {
          cache.set(cacheKey, returnValue.data);
        }

        return returnValue;
      }.bind(this)).then(this._extractData);
  },

  post: function(customerId, url, data, options) {
    var opts = this._getOptions(options);

    this._suiteRequest = this._createRequest(opts);

    var completeUrl = this._assembleUrl(customerId, url);
    return this._suiteRequest.post(completeUrl, data, options).then(this._extractData);
  },

  put: function(customerId, url, data, options) {
    var opts = this._getOptions(options);

    this._suiteRequest = this._createRequest(opts);

    var completeUrl = this._assembleUrl(customerId, url);
    return this._suiteRequest.put(completeUrl, data, options).then(this._extractData);
  },

  setCache: function(cacheId) {
    this._cacheId = cacheId;
  },

  _assembleUrl: function(customerId, url) {
    return '/' + customerId + url;
  },

  _extractData: function(response) {
    return response.data;
  },

  _getOptions: function(options) {
    options = options || {};
    return {
      environment: options.environment || this.options.environment,
      rejectUnauthorized: options.rejectUnauthorized || this.options.rejectUnauthorized,
      apiKey: options.apiKey || this.options.apiKey,
      apiSecret: options.apiSecret || this.options.apiSecret
    };
  },

  _createRequest: function(options) {
    var requestOptions = SuiteRequestOptions.createForInternalApi(options.environment, options.rejectUnauthorized);
    var suiteRequest = SuiteRequest.create(options.apiKey, options.apiSecret, requestOptions);

    return suiteRequest;
  },

  _getCacheKey: function(method, url, data) {
    var cacheIdParts = [
      this._cacheId || 'global',
      method || 'get',
      url || 'noUrl',
      data ? JSON.stringify(data) : 'noData'
    ];

    return cacheIdParts.join('#');
  }

});


InternalApiRequest.create = function(options) {
  return new InternalApiRequest(options);
};


module.exports = InternalApiRequest;