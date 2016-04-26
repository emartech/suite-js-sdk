'use strict';

var util = require('util');
var _ = require('lodash');
var logger = require('logentries-logformat')('suite-sdk');

var Base = require('../_base');

var ExternalEvent = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(ExternalEvent, Base);

_.extend(ExternalEvent.prototype, {
  create: function(payload, options) {
    return this._requireParameters(payload, ['name']).then(function() {
      logger.log('externalevent_create');
      return this._request.post(
        this._getCustomerId(options),
        '/event',
        this._cleanPayload(payload, ['event_id']),
        options
      );
    }.bind(this));
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
    logger.log('externalevent_list');
    return this._request.get(
      this._getCustomerId(options),
      '/event',
      options
    );
  },

  update: function(payload, options) {
    return this._requireParameters(payload, ['event_id', 'name']).then(function() {
      logger.log('externalevent_update');
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
      logger.log('externalevent_update');
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
      logger.log('externalevent_trigger');

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
