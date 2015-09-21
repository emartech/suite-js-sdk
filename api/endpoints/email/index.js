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


  get: function(payload, options) {
    return this._requireParameters(payload, ['email_id']).then(function() {
      var url = util.format('/email/%s', payload.email_id);
      logger.log('email_get');

      return this._request.get(
        this._getCustomerId(options),
        this._buildUrl(url, payload, ['email_id']),
        options
      );
    }.bind(this));
  },


  patch: function(payload, options) {
    return this._requireParameters(payload, ['email_id']).then(function() {
      logger.log('email_patch');

      return this._request.post(
        this._getCustomerId(options),
        util.format('/email/%s/patch', payload.email_id),
        this._cleanPayload(payload, ['email_id']),
        options
      );
    }.bind(this));
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
  },

  launchList: function(payload, options) {
    return this._requireParameters(payload, ['emailid']).then(function() {
      logger.log('email_getlaunchesofemail');

      return this._request.post(
        this._getCustomerId(options),
        '/email/getlaunchesofemail',
        this._cleanPayload(payload),
        options
      );
    }.bind(this));
  }
});


Email.create = function(request, options) {
  return new Email(request, options);
};

module.exports = Email;
