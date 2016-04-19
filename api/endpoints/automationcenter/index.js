'use strict';

var util = require('util');
var _ = require('lodash');
var logger = require('logentries-logformat')('suite-sdk');

var Base = require('../_base');

var AutomationCenter = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(AutomationCenter, Base);

_.extend(AutomationCenter.prototype, {

  programResource: function(payload, options) {
    return this._requireParameters(payload, ['service_id']).then(function() {
      logger.log('automationcenter_programresource');

      var url = util.format('/programresource/service_id=%s', payload.service_id);
      if (payload.resource_id) {
        url += util.format('&resource_id=%d', payload.resource_id);
      }

      return this._request.get(
        this._getCustomerId(options),
        url,
        options
      );
    }.bind(this));
  }

});


AutomationCenter.create = function(request, options) {
  return new AutomationCenter(request, options);
};

module.exports = AutomationCenter;
