'use strict';

var util = require('util');
var _ = require('lodash');
var logger = require('logentries-logformat')('suite-sdk');

var Base = require('../_base');

var Campaign = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(Campaign, Base);

_.extend(Campaign.prototype, {

  register: function(payload, options) {
    logger.log('campaign_register');

    return this._request.post(
      this._getCustomerId(options),
      '/campaigns',
      payload,
      options
    );
  }

});


Campaign.create = function(request, options) {
  return new Campaign(request, options);
};

module.exports = Campaign;
