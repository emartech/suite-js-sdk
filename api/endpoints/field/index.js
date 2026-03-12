'use strict';

var util = require('util');
var _ = require('lodash');

const { createLogger } = require('@emartech/json-logger');
const logger = createLogger('suite-sdk');

var Base = require('../_base');

var Field = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(Field, Base);

_.extend(Field.prototype, {

  create: function(payload, options) {
    logger.info('field_create');

    return this._request.post(
      this._getCustomerId(options),
      '/field',
      payload,
      options
    );
  },


  get: function(payload, options) {
    return this._requireParameters(payload, ['translate_id']).then(function() {
      var url = util.format('/field/translate/%s', payload.translate_id);
      logger.info('field_get');

      return this._request.get(
        this._getCustomerId(options),
        this._buildUrl(url, payload, ['translate_id']),
        options
      );
    }.bind(this));
  },


  getChoices: function(payload, options) {
    return this._requireParameters(payload, ['field_id']).then(function() {
      const url = payload.translate_id ?
        util.format('/field/%d/choice/translate/%s', payload.field_id, payload.translate_id) :
        util.format('/field/%d/choice', payload.field_id);

      logger.info('field_get_choices');

      return this._request.get(
        this._getCustomerId(options),
        url,
        options
      );
    }.bind(this));
  },


  getMultipleChoices: function(payload, options) {
    return this._requireParameters(payload, ['field_ids']).then(function() {
      const url = payload.translate_id ?
        util.format('/field/choices?fields=%s&language=%s', payload.field_ids.join(','), payload.translate_id) :
        util.format('/field/choices?fields=%s', payload.field_ids.join(','));

      logger.info('field_get_multiple_choices');

      return this._request.get(
        this._getCustomerId(options),
        url,
        options
      );
    }.bind(this));
  },

  delete: function(payload, options) {
    return this._requireParameters(payload, ['field_id']).then(function() {
      var url = util.format('/field/%s', payload.field_id);
      logger.info('field_delete');

      return this._request.delete(this._getCustomerId(options), url, options);
    }.bind(this));
  }

});


Field.create = function(request, options) {
  return new Field(request, options);
};

module.exports = Field;
