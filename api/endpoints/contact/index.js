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

  _useStringIds: function(options) {
    return _.get(options, 'stringIds', false);
  },

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

  createOrUpdate: function(payload, options) {
    logger.log('contact_update');

    return this._request.put(
      this._getCustomerId(options),
      '/contact/create_if_not_exists=1',
      payload,
      options
    );
  },

  getData: function(payload, options) {
    return this._requireParameters(payload, ['keyValues']).then(function() {
      logger.log('contact_getdata');

      var url = this._useStringIds(options) ? '/contact/getdata/stringids=1' : '/contact/getdata';

      return this._request.post(
        this._getCustomerId(options),
        url,
        payload,
        options
      );
    }.bind(this));
  },

  query: function(payload, options) {
    return this._requireParameters(payload, ['returnFieldId']).then(function() {
      logger.log('contact_query');

      var url = '/contact/query/return=' + payload.returnFieldId;
      if (payload.queryFieldId) {
        url += '&' + payload.queryFieldId + '=' + payload.queryFieldValue;
      }
      if (payload.limit) {
        url += '&limit=' + payload.limit;
      }
      if (payload.offset) {
        url += '&offset=' + payload.offset;
      }

      return this._request.get(
        this._getCustomerId(options),
        url,
        options
      );
    }.bind(this));
  },

  merge: function(payload, options) {
    logger.log('contact_merge');

    return this._request.post(
      this._getCustomerId(options),
      '/contact/merge',
      payload,
      options
    );
  },

  delete: function(payload, options) {
    logger.log('contact_delete');

    return this._request.post(
      this._getCustomerId(options),
      '/contact/delete',
      payload,
      options
    );
  }



});

Contact.create = function(request, options) {
  return new Contact(request, options);
};

module.exports = Contact;
