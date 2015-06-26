'use strict';

var util = require('util');
var _ = require('lodash');

var SuiteRequest = require('escher-suiteapi-js');
var SuiteRequestOptions = SuiteRequest.Options;

var Request = require('./../api-request');

var InternalApiRequest = function(options) {
  Request.call(this);
  this.options = options;
};

util.inherits(InternalApiRequest, Request);

_.extend(InternalApiRequest.prototype, {

  get: function(customerId, url, options) {
    var opts = this._getOptions(options);

    this._suiteRequest = this._createRequest(opts);
    this._suiteRequest.setCache(this._cacheId);

    var completeUrl = this._assembleUrl(customerId, url);
    return this._suiteRequest.get(completeUrl).then(this._extractData);
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

    return Request.create(suiteRequest);
  }

});


InternalApiRequest.create = function(options) {
  return new InternalApiRequest(options);
};


module.exports = InternalApiRequest;
