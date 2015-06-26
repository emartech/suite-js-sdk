var _ = require('lodash');
var querystring = require('querystring');

var Base = function(options) {
  options = options || {};
  this.customerId = options.customerId;
};

Base.prototype._getCustomerId = function(options) {
  options = options || {};
  return options.customerId || this.customerId;
};

Base.prototype._cleanPayload = function(payload, blackList) {
  if (!blackList) {
    return payload;
  }

  return _.transform(payload, function(result, n, key) {
    if (blackList.indexOf(key) === -1) {
      result[key] = n;
    }
  });
};

Base.prototype._buildUrl = function(base, payload, blackList) {
  payload = this._cleanPayload(payload, blackList);

  var qs = querystring.stringify(payload);

  if (qs.length) {
    return base + '/?' + querystring.stringify(payload);
  }

  return base;
};

module.exports = Base;
