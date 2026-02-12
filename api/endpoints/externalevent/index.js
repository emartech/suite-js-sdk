'use strict';

var util = require('util');
var _ = require('lodash');

const { createLogger } = require('@emartech/json-logger');
const logger = createLogger('suite-sdk');

var Base = require('../_base');

var ExternalEvent = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(ExternalEvent, Base);

_.extend(ExternalEvent.prototype, {
  create: function(payload, options) {
    logger.info('externalevent_create');
    return this._request.post(
      this._getCustomerId(options),
      '/event',
      payload,
      options
    );
  },

  get: function(payload, options) {
    return this._requireParameters(payload, ['event_id']).then(function() {
      return this._request.get(
        this._getCustomerId(options),
        util.format('/event/%s', payload.event_id),
        options
      );
    }.bind(this));
  },

  list: function(payload, options) {
    logger.info('externalevent_list');
    return this._request.get(
      this._getCustomerId(options),
      '/event',
      options
    );
  },

  usages: function(payload, options) {
    logger.info('externalevent_usages');
    return this._requireParameters(payload, ['event_id']).then(function() {
      return this._request.get(
        this._getCustomerId(options),
        util.format('/event/%s/usages', payload.event_id),
        options
      );
    }.bind(this));
  },

  update: function(payload, options) {
    return this._requireParameters(payload, ['event_id']).then(function() {
      logger.info('externalevent_update');
      return this._request.post(
        this._getCustomerId(options),
        util.format('/event/%s', payload.event_id),
        this._cleanPayload(payload, ['event_id']),
        options
      );
    }.bind(this));
  },

  delete: function(payload, options) {
    return this._requireParameters(payload, ['event_id']).then(function() {
      logger.info('externalevent_update');
      return this._request.post(
        this._getCustomerId(options),
        util.format('/event/%s/delete', payload.event_id),
        this._cleanPayload(payload, ['event_id']),
        options
      );
    }.bind(this));

  },


  trigger: function(payload, options) {
    return this._requireParameters(payload, ['event_id']).then(function() {
      logger.info('externalevent_trigger');

      return this._request.post(
        this._getCustomerId(options),
        util.format('/event/%s/trigger', payload.event_id),
        this._cleanPayload(payload, ['event_id']),
        options
      );
    }.bind(this));
  }

});

ExternalEvent.create = function(request, options) {
  return new ExternalEvent(request, options);
};

module.exports = ExternalEvent;
