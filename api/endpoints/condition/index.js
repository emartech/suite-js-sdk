'use strict';

var util = require('util');
var _ = require('lodash');

const { createLogger } = require('@emartech/json-logger');
const logger = createLogger('suite-sdk');

var Base = require('../_base');

var Condition = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(Condition, Base);

_.extend(Condition.prototype, {
  list: function(payload, options) {
    logger.info('condition_list');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/condition', payload),
      options
    );
  },

  listWithContactFields: function(payload, options) {
    logger.info('condition_list_with_contact_fields');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/condition/contact_fields', payload),
      options
    );
  }
});


Condition.create = function(request, options) {
  return new Condition(request, options);
};

module.exports = Condition;
