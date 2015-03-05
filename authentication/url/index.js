'use strict';

var Escher = require('escher-auth');
var _ = require('lodash');


var SuiteSignedUrlAuthenticator = function(options) {
  options = _.extend({}, {
    escherSecret: process.env.SUITE_ESCHER_SECRET,
    credentialScope: process.env.SUITE_ESCHER_CREDENTIAL_SCOPE
  }, options);

  this.escherSecret = options.escherSecret;

  this.escher = Escher.create({
    algoPrefix: 'EMS',
    vendorKey: 'EMS',
    credentialScope: options.credentialScope
  });
};

SuiteSignedUrlAuthenticator.prototype = {

  authenticate: function(url, host) {
    try {
      this.escher.authenticate(this._getAuthParams(url, host), this._getSecret.bind(this));
    } catch (ex) {
      throw new Error('Escher authentication');
    }
  },


  _getAuthParams: function(url, host) {
    return {
      method: 'GET',
      url: url,
      headers: [
        ['Host', host]
      ]
    };
  },


  _getSecret: function() {
    return this.escherSecret;
  }

};


SuiteSignedUrlAuthenticator.create = function(options) {
  return new SuiteSignedUrlAuthenticator(options);
};


module.exports = SuiteSignedUrlAuthenticator;
