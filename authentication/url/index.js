'use strict';

var Escher = require('escher-auth');
var _ = require('lodash');
var KeyPool = require('escher-keypool');


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
      var getSecretFn = this.escherSecret ? this._getSecret.bind(this) : this._getSecretFromKeypool();
      this.escher.authenticate(this._getAuthParams(url, host), getSecretFn);
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
  },


  _getSecretFromKeypool: function() {
    return new KeyPool(process.env.KEY_POOL).getKeyDb();
  }

};


SuiteSignedUrlAuthenticator.create = function(options) {
  return new SuiteSignedUrlAuthenticator(options);
};


module.exports = SuiteSignedUrlAuthenticator;
