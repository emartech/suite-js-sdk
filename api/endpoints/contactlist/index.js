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
    var url = '/contactlist';
    logger.log('contactlist_create');

    return this._request.post(
      this._getCustomerId(options),
      url,
      payload,
      options
    );
  },


  list: function(payload, options) {
    var url = util.format('/contactlist/%s/contacts', payload.contactListId);
    logger.log('contactlist_list');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl(url, payload, ['contactListId']),
      options
    );
  }

});

ContactList.create = function(request, options) {
  return new ContactList(request, options);
};

module.exports = ContactList;
