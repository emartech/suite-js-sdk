'use strict';

var util = require('util');
var _ = require('lodash');
var logger = require('logentries-logformat')('suite-sdk');

var Base = require('../_base');

var Field = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(Field, Base);

_.extend(Field.prototype, {

  get: function(payload, options) {
    return this._requireParameters(payload, ['translate_id']).then(function() {
      var url = util.format('/field/translate/%s', payload.translate_id);
      logger.log('field_get');

      return this._request.get(
        this._getCustomerId(options),
        this._buildUrl(url, payload, ['translate_id']),
        options
      );
    }.bind(this));
  }

});


Field.create = function(request, options) {
  return new Field(request, options);
};

module.exports = Field;
