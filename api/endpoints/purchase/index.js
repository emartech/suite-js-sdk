'use strict';

var util = require('util');
var _ = require('lodash');

const { createLogger } = require('@emartech/json-logger');
const logger = createLogger('suite-sdk');

var Base = require('../_base');

var Purchase = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(Purchase, Base);

_.extend(Purchase.prototype, {

  list: function(payload, options) {
    logger.info('purchase_list');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/purchases', payload),
      options
    );
  },

  stats: function(payload, options) {
    logger.info('purchases_stats');

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
