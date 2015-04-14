'use strict';

var Promise = require('bluebird');
var _ = require('lodash');
var NodeCache = require('node-cache');
var promiseRetryer = require('promise-retryer')(Promise);
var logger = require('logentries-logformat')('suiterequest-debug');

var CACHE_TTL = 120;
var CURRENTLY_EVALUATED_CODE = 10001;
var cache = new NodeCache( { stdTTL: CACHE_TTL, checkperiod: CACHE_TTL + 10 } );

var ApiRequest = function(suiteRequest) {
  this._suiteRequest = suiteRequest;
  this._cacheId = null;
};

ApiRequest.prototype = {

  get: function(url) {
    var response;
    var _this = this;
    var cacheKey = this._getCacheKey('get', url);

    if (this._cacheId) {
      response = cache.get(cacheKey);
      if (response[cacheKey]) return Promise.resolve(response[cacheKey]);
    }

    logger.log('get', { destinationEndpoint: url });

    return promiseRetryer.run({
      delay: function (attempt) {
        return attempt * attempt * 300;
      },
      maxRetries: 3,
      promise: function () {
        return _this._suiteRequest
          .get(url)
          .then(function(returnValue) {
            if (this._cacheId) {
              cache.set(cacheKey, returnValue.data);
            }

            return returnValue.data;
          }.bind(_this));
      },
      validate: function (response) {
        return new Promise(function (resolve, reject) {
          if (response.replyCode === CURRENTLY_EVALUATED_CODE) {
            reject (response);
          } else {
            resolve (response);
          }
        });
      }
    });


  },


  post: function(url, data) {
    logger.log('post', _.extend({ destinationEndpoint: url }, data));
    return this._suiteRequest
      .post(url, data)
      .then(function(returnValue) {
        return returnValue.data;
      });
  },


  put: function(url, data) {
    logger.log('put', _.extend({ destinationEndpoint: url }, data));
    return this._suiteRequest
      .put(url, data)
      .then(function(returnValue) {
        return returnValue.data;
      });
  },


  setCache: function(cacheId) {
    this._cacheId = cacheId;
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

};




ApiRequest.create = function(suiteRequest) {
  return new ApiRequest(suiteRequest);
};


module.exports = ApiRequest;
module.exports.CACHE_TTL = CACHE_TTL;