'use strict';

var util = require('util');
var _ = require('lodash');
var logger = require('logentries-logformat')('suite-sdk');

var Base = require('../_base');

var Contact = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(Contact, Base);

_.extend(Contact.prototype, {

  create: function(payload, options) {
    logger.log('contact_create');

    return this._request.post(
      this._getCustomerId(options),
      '/contact',
      payload,
      options
    );
  },

  update: function(payload, options) {
    logger.log('contact_update');

    return this._request.put(
      this._getCustomerId(options),
      '/contact',
      payload,
      options
    );
  },

  getData: function(payload, options) {
    return this._requireParameters(payload, ['keyValues']).then(function() {
      logger.log('contact_getdata');

      return this._request.post(
        this._getCustomerId(options),
        '/contact/getdata',
        payload,
        options
      );
    }.bind(this));
  }



});

Contact.create = function(request, options) {
  return new Contact(request, options);
};

module.exports = Contact;
