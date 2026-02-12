'use strict';

var util = require('util');
var _ = require('lodash');

const { createLogger } = require('@emartech/json-logger');
const logger = createLogger('suite-sdk');

var Base = require('../_base');

var Source = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(Source, Base);

_.extend(Source.prototype, {

  listSources: function(payload, options) {
    logger.info('source_list');

    return this._request.get(
      this._getCustomerId(options),
      '/source',
      options
    );
  },

  create: function(payload, options) {
    logger.info('source_create');

    return this._request.post(
      this._getCustomerId(options),
      '/source/create',
      payload,
      options
    );
  }
});

Source.create = function(request, options) {
  return new Source(request, options);
};

module.exports = Source;
