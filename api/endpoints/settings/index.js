'use strict';

var logger = require('logentries-logformat')('suite-sdk');


var Settings = function(request) {
  this._request = request;
};

Settings.prototype = {

  getSettings: function(customerId, options) {
    logger.log('settings_getSettings');
    return this._request.get(customerId, '/settings', options);
  },


  getCorporateDomains: function(customerId, options) {
    logger.log('settings_get-corporate-domains');
    return this._request.get(customerId, '/settings/corporatedomain', options);
  },


  setCorporateDomains: function(customerId, domains, options) {
    logger.log('settings_set-corporate-domains');
    return this._request.put(customerId, '/settings/corporatedomain', { domains: domains }, options);
  }

};

Settings.create = function(request) {
  return new Settings(request);
};

module.exports = Settings;
