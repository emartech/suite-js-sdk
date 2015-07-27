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
    var err;

    try {
      this.escher.authenticate(this._getAuthParams(url, host), this._getKeyDb());
    } catch (ex) {
      err = new Error('Escher authentication');
      err.reason = ex.message;
      throw err;
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


  _getKeyDb: function() {
    if (this.escherSecret) return this._getSecret.bind(this);
    if (process.env.KEY_POOL) return new KeyPool(process.env.KEY_POOL).getKeyDb();
    return function() {};
  },


  _getSecret: function() {
    return this.escherSecret;
  }

};


SuiteSignedUrlAuthenticator.create = function(options) {
  return new SuiteSignedUrlAuthenticator(options);
};


module.exports = SuiteSignedUrlAuthenticator;
