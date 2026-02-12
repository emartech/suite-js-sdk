'use strict';

var util = require('util');
var _ = require('lodash');

const { createLogger } = require('@emartech/json-logger');
const logger = createLogger('suite-sdk');

var Base = require('../_base');

var Export = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(Export, Base);

_.extend(Export.prototype, {

  getData: function(payload, options) {
    return this._requireParameters(payload, ['export_id']).then(function() {
      logger.info('get_export_data');
      return this._request.get(
        this._getCustomerId(options),
        util.format('/export/%s/data/offset=%s&limit=%s', payload.export_id, payload.offset || '', payload.limit || ''),
        options
      );
    }.bind(this));
  },

  getChanges: function(payload, options) {
    logger.info('contact_getchanges');

    return this._request.post(
      this._getCustomerId(options),
      '/contact/getchanges',
      payload,
      options
    );
  }

});

Export.create = function(request, options) {
  return new Export(request, options);
};

module.exports = Export;
