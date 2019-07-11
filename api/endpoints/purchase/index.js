'use strict';

var logger = require('logentries-logformat')('suite-sdk');
var util = require('util');
var _ = require('lodash');

var Base = require('../_base');

var Purchase = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(Purchase, Base);

_.extend(Purchase.prototype, {

  list: function(payload, options) {
    logger.log('purchase_list');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/purchases', payload),
      options
    );
  },

  stats: function(payload, options) {
    logger.log('purchases_stats');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/purchases/stats', payload),
      options
    );
  }

});

Purchase.create = function(request, options) {
  return new Purchase(request, options);
};

module.exports = Purchase;
