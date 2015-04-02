'use strict';

var util = require('util');
var _ = require('lodash');
var Request = require('./../api-request');

var InternalApiRequest = function (suiteRequest) {
  Request.call(this, suiteRequest);
};

util.inherits(InternalApiRequest, Request);

_.extend(InternalApiRequest.prototype, {

  get: function (customerId, url) {
    var completeUrl = this._assembleUrl(customerId, url);
    return Request.prototype.get.call(this, completeUrl).then(this._extractData);
  },


  post: function (customerId, url, data) {
    var completeUrl = this._assembleUrl(customerId, url);
    return Request.prototype.post.call(this, completeUrl, data).then(this._extractData);
  },


  put: function (customerId, url, data) {
    var completeUrl = this._assembleUrl(customerId, url);
    return Request.prototype.put.call(this, completeUrl, data).then(this._extractData);
  },


  _assembleUrl: function(customerId, url) {
    return '/' + customerId + url;
  },


  _extractData: function (response) {
    return response.data;
  }

});


InternalApiRequest.create = function (suiteRequest) {
  return new InternalApiRequest(suiteRequest);
};


module.exports = InternalApiRequest;