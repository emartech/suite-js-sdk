'use strict';

var util = require('util');
var logger = require('logentries-logformat')('suite-sdk');

var ContactList = function (request) {
  this._request = request;
};

ContactList.prototype.create = function (customerId, name, contactIds) {
  var url = '/contactlist';
  logger.log('contactlist_create');
  return this._request.post(customerId, url, {
    key_id: 'id',
    name: name,
    external_ids: contactIds
  });
};

ContactList.prototype.list = function (customerId, contactListId) {
  var url = util.format('/contactlist/%s', contactListId);
  logger.log('contactlist_list');
  return this._request.get(customerId, url);
};

ContactList.create = function (request) {
  return new ContactList(request);
};

module.exports = ContactList;
