'use strict';

const util = require('util');
const _ = require('lodash');

const { createLogger } = require('@emartech/json-logger');
const logger = createLogger('suite-sdk');

const Base = require('../_base');

const Keyring = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(Keyring, Base);

_.extend(Keyring.prototype, {
  list: function(payload, options) {
    logger.info('keyring_keys');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/settings/keyring/keys', payload),
      options
    );
  },

  get: function(payload, options) {
    return this._requireParameters(payload, ['key_id']).then(function() {
      logger.info('keyring_get_key');

      return this._request.get(
        this._getCustomerId(options),
        util.format('/settings/keyring/keys/%d', payload.key_id),
        options
      );
    }.bind(this));
  },

  create: function(payload, options) {
    return this._requireParameters(payload, ['comment']).then(function() {
      logger.info('keyring_create_key');

      return this._request.post(
        this._getCustomerId(options),
        '/settings/keyring/keys',
        { comment: payload.comment },
        options);
    }.bind(this));
  },

  delete: function(payload, options) {
    return this._requireParameters(payload, ['key_id']).then(function() {
      logger.info('keyring_delete_key');

      return this._request.post(
        this._getCustomerId(options),
        util.format('/settings/keyring/keys/%d/delete', payload.key_id),
        {},
        options);
    }.bind(this));
  }
});


Keyring.create = function(request, options) {
  return new Keyring(request, options);
};

module.exports = Keyring;
