'use strict';

var _ = require('lodash');
var querystring = require('querystring');
var APIRequiredParameterMissingError = require('./error');

var Base = function(options) {
  this.options = options || {};
};

_.extend(Base.prototype, {
  _getCustomerId: function(options) {
    options = options || {};
    return options.customerId || this.options.customerId;
  },


  _requireParameters: function(payload, requiredParameters) {
    try {
      requiredParameters.forEach(function(requiredParameter) {
        if (_.has(payload, requiredParameter)) {
          return;
        }
        throw new APIRequiredParameterMissingError(requiredParameter);
      });
    } catch (ex) {
      return Promise.reject(ex);
    }

    return Promise.resolve();
  },


  _cleanPayload: function(payload, blackList) {
    return _.omit(payload, blackList);
  },


  _buildUrl: function(base, payload, blackList) {
    payload = this._cleanPayload(payload, blackList);

    var qs = querystring.stringify(payload);

    if (qs.length) {
      return base + '/?' + qs;
    }

    return base;
  },

  _buildUrlForSegmentation: function(base, payload, blackList) {
    payload = this._cleanPayload(payload, blackList);

    var qs = querystring.stringify(payload);

    if (qs.length) {
      return base + '/' + qs;
    }

    return base;
  }
});

module.exports = Base;
