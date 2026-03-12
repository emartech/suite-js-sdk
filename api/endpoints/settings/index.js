'use strict';

var util = require('util');
var _ = require('lodash');

const { createLogger } = require('@emartech/json-logger');
const logger = createLogger('suite-sdk');

var Base = require('../_base');

var Settings = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(Settings, Base);

_.extend(Settings.prototype, {

  getSettings: function(payload, options) {
    logger.info('settings_get_settings');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/settings', payload),
      options
    );
  },


  getCorporateDomains: function(payload, options) {
    logger.info('settings_get_corporate_domains');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/settings/corporatedomain', payload),
      options
    );
  },


  setCorporateDomains: function(payload, options) {
    logger.info('settings_set_corporate_domains');

    return this._request.put(
      this._getCustomerId(options),
      '/settings/corporatedomain',
      payload,
      options
    );
  },

  getDeliverability: function(payload, options) {
    logger.info('settings_get_deliverability');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/settings/deliverability', payload),
      options
    );
  },

  getIpRestrictions: function(payload, options) {
    logger.info('settings_get-ip-restrictions');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/settings/iprestrictions', payload),
      options
    );
  },

  setIpRestrictions: function(payload, options) {
    logger.info('settings_set-ip-restrictions');

    return this._request.put(
      this._getCustomerId(options),
      '/settings/iprestrictions',
      payload,
      options
    );
  },

  getLanguages: function(payload, options) {
    return this._requireParameters(payload, ['translate']).then(function() {
      logger.info('settings_get_languages');

      return this._request.get(
        this._getCustomerId(options),
        util.format('/settings/languages/translation/%s', payload.translate),
        options
      );
    }.bind(this));
  },

  getLinkCategories: function(payload, options) {
    logger.info('settings_get_linkcategories');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/settings/linkcategories', payload),
      options
    );
  },

  getSecuritySettings: function(payload, options) {
    logger.info('settings_get_security-settings');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/settings/security', payload),
      options
    );
  },

  setSecuritySettings: function(payload, options) {
    logger.info('settings_set-security-settings');

    return this._request.put(
      this._getCustomerId(options),
      '/settings/security',
      payload,
      options
    );
  },

  getDeliverabilitySenderDomains: function(payload, options) {
    logger.info('settings_get-senderdomains');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/settings/deliverability/sender_domains', payload),
      options
    );
  },

  setDeliverabilitySenderDomain: function(payload, options) {
    logger.info('settings_set-senderdomain');

    return this._request.put(
      this._getCustomerId(options),
      '/settings/deliverability/sender_domains',
      payload,
      options
    );
  }
});

Settings.create = function(request, options) {
  return new Settings(request, options);
};

module.exports = Settings;
