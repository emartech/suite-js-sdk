'use strict';

var _ = require('lodash');
var NodeCache = require('node-cache');

var SuiteRequest = require('escher-suiteapi-js');
var SuiteRequestOptions = SuiteRequest.Options;

var config = require('../../config');

var cache = new NodeCache({ stdTTL: config.CACHE_TTL, checkperiod: config.CACHE_TTL + 10, useClones: false });

var ApiRequest = function(options) {
  this._cacheId = null;
  this.options = options;
};

_.extend(ApiRequest.prototype, {

  get: function(customerId, url, options) {
    var opts = this._getOptions(options);
    var response;

    var cacheKey = this._getCacheKey('get', url);

    if (this._cacheId) {
      response = cache.get(cacheKey);
      if (response) {
        return Promise.resolve(response);
      }
    }

    this._suiteRequest = this._createRequest(opts);

    var completeUrl = this._assembleUrl(customerId, url);
    return this._suiteRequest
      .get(completeUrl)
      .then(function(returnValue) {
        if (this._cacheId) {
          cache.set(cacheKey, returnValue);
        }

        return returnValue;
      }.bind(this));
  },

  post: function(customerId, url, data, options) {
    var opts = this._getOptions(options);

    this._suiteRequest = this._createRequest(opts);

    var completeUrl = this._assembleUrl(customerId, url);
    return this._suiteRequest.post(completeUrl, data, options);
  },

  put: function(customerId, url, data, options) {
    var opts = this._getOptions(options);

    this._suiteRequest = this._createRequest(opts);

    var completeUrl = this._assembleUrl(customerId, url);
    return this._suiteRequest.put(completeUrl, data, options);
  },

  setCache: function(cacheId) {
    this._cacheId = cacheId;
  },

  _assembleUrl: function(customerId, url) {
    return '/' + this._encodeCustomerId(customerId) + url;
  },

  _encodeCustomerId: function(customerId) {
    var matches = customerId.toString().match(/^name:(.*)$/);

    if (matches && matches[1]) {
      return 'name:' + encodeURIComponent(matches[1]);
    } else {
      return customerId;
    }
  },

  _getOptions: function(options) {
    options = options || {};
    return {
      environment: options.environment || this.options.environment,
      rejectUnauthorized: _.isUndefined(options.rejectUnauthorized) ? this.options.rejectUnauthorized : options.rejectUnauthorized,
      apiKey: options.apiKey || this.options.apiKey,
      apiSecret: options.apiSecret || this.options.apiSecret,
      port: options.port || this.options.port,
      secure: _.isUndefined(options.secure) ? this.options.secure : options.secure
    };
  },

  _createRequest: function(options) {
    var requestOptions = SuiteRequestOptions.createForInternalApi(options);
    return SuiteRequest.create(options.apiKey, options.apiSecret, requestOptions);
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


ApiRequest.create = function(options) {
  return new ApiRequest(options);
};


module.exports = ApiRequest;
