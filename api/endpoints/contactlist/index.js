'use strict';

var util = require('util');
var _ = require('lodash');
var logger = require('logentries-logformat')('suite-sdk');

var Base = require('../_base');

var ContactList = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(ContactList, Base);

_.extend(ContactList.prototype, {

  create: function(payload, options) {
    logger.log('contactlist_create');

    return this._request.post(
      this._getCustomerId(options),
      '/contactlist',
      payload,
      options
    );
  },


  list: function(payload, options) {
    return this._requireParameters(payload, ['contact_list_id']).then(function() {
      var url = util.format('/contactlist/%s/contacts', payload.contact_list_id);
      logger.log('contactlist_list');

      return this._request.get(
        this._getCustomerId(options),
        this._buildUrl(url, payload, ['contact_list_id']),
        options
      );
    }.bind(this));
  }

});

ContactList.create = function(request, options) {
  return new ContactList(request, options);
};

module.exports = ContactList;
