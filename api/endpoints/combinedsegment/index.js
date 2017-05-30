'use strict';

var util = require('util');
var logger = require('logentries-logformat')('suite-sdk');
var _ = require('lodash');

var Base = require('../_base');

var CombinedSegment = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(CombinedSegment, Base);

_.extend(CombinedSegment.prototype, {

  list: function(payload, options) {
    logger.log('combined_segment_list');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrlForSegmentation('/combinedsegments', payload),
      options
    );
  },

  create: function(payload, options) {
    logger.log('combined_segment_create');

    return this._request.post(
      this._getCustomerId(options),
      '/combinedsegments',
      payload,
      options
    );
  },

  get: function(payload, options) {
    return this._requireParameters(payload, ['segment_id']).then(function() {
      var url = util.format('/combinedsegments/%s', payload.segment_id);
      logger.log('combined_segment_get_definition');

      return this._request.get(
        this._getCustomerId(options),
        url,
        options
      );
    }.bind(this));
  },

  update: function(payload, options) {
    return this._requireParameters(payload, ['segment_id']).then(function() {
      var url = util.format('/combinedsegments/%s', payload.segment_id);
      logger.log('segment_update_contact_criteria');

      return this._request.post(
        this._getCustomerId(options),
        url,
        payload.segment_data,
        options
      );
    }.bind(this));
  }

});

CombinedSegment.create = function(request, options) {
  return new CombinedSegment(request, options);
};

module.exports = CombinedSegment;
