'use strict';

var logger = require('logentries-logformat')('suite-sdk');

var ContactList = function (request) {
  this._request = request;
};

ContactList.prototype.create = function (customerId, name, contactIds) {
  var url = '/contactlist';
  logger.log('contactlist_create');
  return this._request.post(customerId, url, {
    name: name,
    external_ids: contactIds
  });
};

ContactList.create = function (request) {
  return new ContactList(request);
};

module.exports = ContactList;
