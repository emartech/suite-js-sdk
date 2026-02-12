'use strict';

var util = require('util');
var _ = require('lodash');

const { createLogger } = require('@emartech/json-logger');
const logger = createLogger('suite-sdk');

var Base = require('../_base');

var Campaign = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(Campaign, Base);

_.extend(Campaign.prototype, {

  create: function(payload, options) {
    logger.info('campaign_create');

    return this._request.post(
      this._getCustomerId(options),
      '/campaigns',
      payload,
      options
    );
  },

  update: function(payload, options) {
    return this._requireParameters(payload, ['campaign_id']).then(function() {
      logger.info('campaign_update');

      return this._request.post(
        this._getCustomerId(options),
        util.format('/campaigns/%s', payload.campaign_id),
        this._cleanPayload(payload, ['campaign_id']),
        options
      );
    }.bind(this));
  }

});


Campaign.create = function(request, options) {
  return new Campaign(request, options);
};

module.exports = Campaign;
