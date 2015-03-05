'use strict';

var logger = require('logentries-logformat')('suite-sdk');


var Settings = function (request) {
  this._request = request;
};

Settings.prototype = {

  getSettings: function(customerId) {
    logger.log('settings_getSettings');
    return this._request.get(customerId, '/settings');
  },


  getCorporateDomains: function (customerId) {
    logger.log('settings_get-corporate-domains');
    return this._request.get(customerId, '/settings/corporatedomain');
  },


  setCorporateDomains: function (customerId, domains) {
    logger.log('settings_set-corporate-domains');
    return this._request.put(customerId, '/settings/corporatedomain', { domains: domains });
  }

};

Settings.create = function(request) {
  return new Settings(request);
};

module.exports = Settings;
