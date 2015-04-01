'use strict';

var Promise = require('bluebird');
var _ = require('lodash');
var NodeCache = require('node-cache');
var logger = require('logentries-logformat')('suiterequest-debug');

var CACHE_TTL = 120;
var cache = new NodeCache( { stdTTL: CACHE_TTL, checkperiod: CACHE_TTL + 10 } );

var Request = function(suiteRequest) {
  this._suiteRequest = suiteRequest;
  this._cacheId = null;
};

Request.prototype = {

  get: function(customerId, url) {
    var response;
    var cacheKey = this._getCacheKey('get', customerId, url);

    if (this._cacheId) {
      response = cache.get(cacheKey);
      if (response[cacheKey]) return Promise.resolve(response[cacheKey]);
    }

    logger.log('get', { destinationEndpoint: '/' + customerId + url });

    return this._suiteRequest
      .get('/' + customerId + url)
      .then(function(returnValue) {
        if (this._cacheId) {
          cache.set(cacheKey, returnValue.data.data);
        }

        return returnValue.data.data;
      }.bind(this));
  },


  post: function(customerId, url, data) {
    logger.log('post', _.extend({ destinationEndpoint: '/' + customerId + url }, data));
    return this._suiteRequest
      .post('/' + customerId + url, data)
      .then(function(returnValue) {
        return returnValue.data.data;
      });
  },


  put: function(customerId, url, data) {
    logger.log('put', _.extend({ destinationEndpoint: '/' + customerId + url }, data));
    return this._suiteRequest
      .put('/' + customerId + url, data)
      .then(function(returnValue) {
        return returnValue.data.data;
      });
  },


  setCache: function(cacheId) {
    this._cacheId = cacheId;
  },


  _getCacheKey: function(method, customerId, url, data) {
    var cacheIdParts = [
      this._cacheId || 'global',
      method || 'get',
      customerId || 'allCustomer',
      url || 'noUrl',
      data ? JSON.stringify(data) : 'noData'
    ];

    return cacheIdParts.join('#');
  }

};




Request.create = function(suiteRequest) {
  return new Request(suiteRequest);
};


module.exports = Request;
module.exports.CACHE_TTL = CACHE_TTL;