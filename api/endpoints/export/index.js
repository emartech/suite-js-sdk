'use strict';

var util = require('util');
var _ = require('lodash');
var logger = require('logentries-logformat')('suite-sdk');

var Base = require('../_base');

var Export = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(Export, Base);

_.extend(Export.prototype, {

  getData: function(payload, options) {
    return this._requireParameters(payload, ['export_id']).then(function() {
      logger.log('get_export_data');
      return this._request.get(
        this._getCustomerId(options),
        util.format('/export/%s/data', payload.export_id),
        options
      );
    }.bind(this));
  }

});

Export.create = function(request, options) {
  return new Export(request, options);
};

module.exports = Export;
