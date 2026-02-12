'use strict';

var util = require('util');
var _ = require('lodash');

const { createLogger } = require('@emartech/json-logger');
const logger = createLogger('suite-sdk');

var Base = require('../_base');

var AutomationCenter = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(AutomationCenter, Base);

_.extend(AutomationCenter.prototype, {

  programResource: function(payload, options) {
    return this._requireParameters(payload, ['service_id']).then(function() {
      logger.info('automationcenter_programresource');

      if (payload.resource_id) {
        var url = util.format('/programresource/service_id=%s&resource_id=%d', payload.service_id, payload.resource_id);
      } else {
        var url = util.format('/programresource/service_id=%s', payload.service_id);
      }

      return this._request.get(
        this._getCustomerId(options),
        url,
        options
      );
    }.bind(this));
  },

  programsEntrypoints: function(payload, options) {
    return this._requireParameters(payload, ['node_type', 'resource_id']).then(function() {
      logger.info('automationcenter_programsentrypoints');

      var url = util.format('/ac/programs/entrypoints/%s/resources/%s/runs', payload.node_type, payload.resource_id);

      return this._request.post(
        this._getCustomerId(options),
        url,
        this._cleanPayload(payload, ['node_type', 'resource_id']),
        options
      );
    }.bind(this));
  }
});


AutomationCenter.create = function(request, options) {
  return new AutomationCenter(request, options);
};

module.exports = AutomationCenter;
