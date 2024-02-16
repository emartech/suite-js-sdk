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
  },

  fetch: function(payload, options) {
    return this._requireParameters(payload, ['contact_list_id']).then(function() {
      logger.log('contactlist_fetch');

      if (payload.next) {
        var url = util.format('/v2%s', payload.next);
        return this._request.get(
          this._getCustomerId(options),
          url,
          options
        );
      }

      var url = util.format('/v2/contactlist/%s/contactIds', payload.contact_list_id);
      return this._request.get(
        this._getCustomerId(options),
        this._buildUrl(url, payload, ['contact_list_id']),
        options
      );
    }.bind(this));
  },

  add: function(payload, options) {
    return this._requireParameters(payload, ['contact_list_id']).then(function() {
      var url = util.format('/contactlist/%s/add', payload.contact_list_id);
      logger.log('contactlist_add');

      // filter out url params from payload
      payload.contact_list_id = undefined;
      payload = _.transform(payload, function(payload, value, key) {
        if (value !== undefined) {
          payload[key] = value;
        }
      });

      return this._request.post(
        this._getCustomerId(options),
        url,
        payload,
        options
      );
    }.bind(this));
  },

  listContactLists: function(payload, options) {
    logger.log('contactlist_list');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/contactlist', payload),
      options
    );
  },

  count: function(payload, options) {
    return this._requireParameters(payload, ['contact_list_id']).then(function() {
      logger.log('contactlist_count');

      var url = util.format('/contactlist/%s/count', payload.contact_list_id);

      return this._request.get(
        this._getCustomerId(options),
        url,
        options
      );
    }.bind(this));
  },

  getContactsData: function(payload, options) {
    return this._requireParameters(payload, ['contact_list_id']).then(function() {
      logger.log('contactlist_getcontactsdata');

      var baseUrl = util.format('/contactlist/%s/contacts/data', payload.contact_list_id);

      return this._request.get(
        this._getCustomerId(options),
        this._buildUrl(baseUrl, payload, ['contact_list_id']),
        options
      );
    }.bind(this));
  },

  deleteList: function(payload, options) {
    return this._requireParameters(payload, ['contact_list_id']).then(function() {
      var url = util.format('/contactlist/%s/deletelist', payload.contact_list_id);
      logger.log('contactlist_deletelist');

      return this._request.post(
        this._getCustomerId(options),
        url,
        this._cleanPayload(payload, ['contact_list_id']),
        options
      );
    }.bind(this));
  }

});

ContactList.create = function(request, options) {
  return new ContactList(request, options);
};

module.exports = ContactList;
