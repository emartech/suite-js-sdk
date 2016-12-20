'use strict';

var util = require('util');
var logger = require('logentries-logformat')('suite-sdk');
var _ = require('lodash');

var Base = require('../_base');

var Source = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(Source, Base);

_.extend(Source.prototype, {

  listSources: function(payload, options) {
    logger.log('source_list');

    return this._request.get(
      this._getCustomerId(options),
      '/source',
      options
    );
  },

  create: function(payload, options) {
    logger.log('source_create');

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
