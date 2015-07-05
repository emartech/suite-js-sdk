var _ = require('lodash');
var querystring = require('querystring');

var Base = function(options) {
  options = options || {};
  this.customerId = options.customerId;
};

_.extend(Base.prototype, {
  _getCustomerId: function(options) {
    options = options || {};
    return options.customerId || this.customerId;
  },

  _cleanPayload: function(payload, blackList) {
    return _.omit(payload, blackList);
  },

  _buildUrl: function(base, payload, blackList) {
    payload = this._cleanPayload(payload, blackList);

    var qs = querystring.stringify(payload);

    if (qs.length) {
      return base + '/?' + querystring.stringify(payload);
    }

    return base;
  }
});

module.exports = Base;
