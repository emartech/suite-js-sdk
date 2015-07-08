'use strict';

var util = require('util');
var _ = require('lodash');
var logger = require('logentries-logformat')('suite-sdk');

var Base = require('../_base');

var Email = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(Email, Base);

_.extend(Email.prototype, {

  copy: function(payload, options) {
    return this._requireParameters(payload, ['email_id']).then(function() {
      logger.log('email_copy');

      return this._request.post(
        this._getCustomerId(options),
        util.format('/email/%s/copy', payload.email_id),
        this._cleanPayload(payload, ['email_id']),
        options
      );
    }.bind(this));
  },


  updateSource: function(payload, options) {
    return this._requireParameters(payload, ['email_id']).then(function() {
      logger.log('email_update_source');

      return this._request.post(
        this._getCustomerId(options),
        util.format('/email/%s/updatesource', payload.email_id),
        this._cleanPayload(payload, ['email_id']),
        options
      );
    }.bind(this));
  },


  list: function(payload, options) {
    logger.log('email_list');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/email', payload),
      options
    );
  },


  launch: function(payload, options) {
    return this._requireParameters(payload, ['email_id']).then(function() {
      logger.log('email_launch');

      return this._request.post(
        this._getCustomerId(options),
        util.format('/email/%s/launch', payload.email_id),
        this._cleanPayload(payload, ['email_id']),
        options
      );
    }.bind(this));
  }
});

Email.create = function(request, options) {
  return new Email(request, options);
};

module.exports = Email;
