'use strict';

var logger = require('logentries-logformat')('suite-sdk');

var ExternalEvent = function(request) {
  this._request = request;
};

ExternalEvent.prototype = {

  trigger: function(customerId, eventId, payload, options) {
    logger.log('externalevent_trigger');
    return this._request.post(customerId, '/event/' + eventId + '/trigger', payload, options);
  }

};

ExternalEvent.create = function(request) {
  return new ExternalEvent(request);
};

module.exports = ExternalEvent;
