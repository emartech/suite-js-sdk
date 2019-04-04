'use strict';

var util = require('util');
var logger = require('logentries-logformat')('suite-sdk');
var _ = require('lodash');

var Base = require('../_base');

var Segment = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(Segment, Base);

_.extend(Segment.prototype, {

  listContacts: function(payload, options) {
    return this._requireParameters(payload, ['segment_id', 'limit']).then(function() {
      var url = util.format('/filter/%s/contacts', payload.segment_id);
      logger.log('segment_list_contacts');

      return this._request.get(
        this._getCustomerId(options),
        this._buildUrlForSegmentation(url, payload, ['segment_id']),
        options
      );
    }.bind(this));
  },

  countContacts: function(payload, options) {
    return this._requireParameters(payload, ['segment_id']).then(function() {
      var url = util.format('/filter/%s/contacts/count', payload.segment_id);
      logger.log('segment_count_contacts');

      return this._request.get(
        this._getCustomerId(options),
        this._buildUrlForSegmentation(url, payload, ['segment_id']),
        options
      );
    }.bind(this));
  },

  listSegments: function(payload, options) {
    logger.log('segment_list');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrlForSegmentation('/filter', payload),
      options
    );
  },

  getSegment: function(payload, options) {
    return this._requireParameters(payload, ['segment_id']).then(function() {
      var url = util.format('/filter/%s', payload.segment_id);
      logger.log('get_segment');

      return this._request.get(
        this._getCustomerId(options),
        this._buildUrlForSegmentation(url, payload, ['segment_id']),
        options
      );
    }.bind(this));
  },

  create: function(payload, options) {
    logger.log('segment_create');

    return this._request.put(
      this._getCustomerId(options),
      '/filter',
      payload,
      options
    );
  },

  getContactCriteria: function(payload, options) {
    return this._requireParameters(payload, ['segment_id']).then(function() {
      var url = util.format('/filter/%s/contact_criteria', payload.segment_id);
      logger.log('segment_get_contact_criteria');

      return this._request.get(
        this._getCustomerId(options),
        this._buildUrlForSegmentation(url, payload, ['segment_id']),
        options
      );
    }.bind(this));
  },

  updateContactCriteria: function(payload, options) {
    return this._requireParameters(payload, ['segment_id']).then(function() {
      var url = util.format('/filter/%s/contact_criteria', payload.segment_id);
      logger.log('segment_update_contact_criteria');

      return this._request.put(
        this._getCustomerId(options),
        url,
        payload.contact_criteria,
        options
      );
    }.bind(this));
  },

  runForSingleContact: function(payload, options) {
    return this._requireParameters(payload, ['segment_id']).then(function() {
      logger.log('segment_run_for_single_contact');

      return this._request.post(
        this._getCustomerId(options),
        util.format('/filter/%s/single_runs', payload.segment_id),
        {},
        options
      );
    }.bind(this));
  },

  singleContactRunStatus: function(payload, options) {
    return this._requireParameters(payload, ['run_id']).then(function() {
      logger.log('segment_single_contact_run_status');

      return this._request.get(
        this._getCustomerId(options),
        util.format('/filter/single_runs/%s', payload.run_id),
        options
      );
    }.bind(this));
  },

  runForMultipleContacts: function(payload, options) {
    return this._requireParameters(payload, ['segment_id']).then(function() {
      logger.log('segment_run_for_multiple_contacts');

      return this._request.post(
        this._getCustomerId(options),
        util.format('/filter/%s/runs', payload.segment_id),
        {},
        options
      );
    }.bind(this));
  },

  multipleContactsRunStatus: function(payload, options) {
    return this._requireParameters(payload, ['run_id']).then(function() {
      logger.log('segment_multiple_contacts_run_status');

      return this._request.get(
        this._getCustomerId(options),
        util.format('/filter/runs/%s', payload.run_id),
        options
      );
    }.bind(this));
  }
});

Segment.create = function(request, options) {
  return new Segment(request, options);
};

module.exports = Segment;
