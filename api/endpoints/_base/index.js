var _ = require('lodash');

var Base = function(options) {
  options = options || {};
  this.customerId = options.customerId;
};

Base.prototype._getCustomerId = function(options) {
  options = options || {};
  return options.customerId || this.customerId;
};

Base.prototype._cleanPayload = function(payload, blackList) {
  return _.transform(payload, function(result, n, key) {
    if (blackList.indexOf(key) === -1) {
      result[key] = n;
    }
  });
};

module.exports = Base;
