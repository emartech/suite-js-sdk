'use strict';

var util = require('util');
var _ = require('lodash');
var logger = require('logentries-logformat')('suite-sdk');

var Base = require('../_base');

var Settings = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(Settings, Base);

_.extend(Settings.prototype, {

  getSettings: function(payload, options) {
    logger.log('settings_get_settings');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/settings', payload),
      options
    );
  },


  getCorporateDomains: function(payload, options) {
    logger.log('settings_get_corporate_domains');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/settings/corporatedomain', payload),
      options
    );
  },


  setCorporateDomains: function(payload, options) {
    logger.log('settings_set_corporate_domains');

    return this._request.put(
      this._getCustomerId(options),
      '/settings/corporatedomain',
      payload,
      options
    );
  },

  getDeliverability: function(payload, options) {
    logger.log('settings_get_deliverability');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/settings/deliverability', payload),
      options
    );
  },

  getIpRestrictions: function(payload, options) {
    logger.log('settings_get-ip-restrictions');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/settings/iprestrictions', payload),
      options
    );
  },

  setIpRestrictions: function(payload, options) {
    logger.log('settings_set-ip-restrictions');

    return this._request.post(
      this._getCustomerId(options),
      '/settings/iprestrictions',
      payload,
      options
    );
  },

  getLinkCategories: function(payload, options) {
    logger.log('settings_get_linkcategories');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/settings/linkcategories', payload),
      options
    );
  }

});

Settings.create = function(request, options) {
  return new Settings(request, options);
};

module.exports = Settings;
