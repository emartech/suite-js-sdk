'use strict';

var KeyPoolError = require('./error');
var _ = require('lodash');
var logger = require('logentries-logformat')('key-pool');

var KeyPool = function (keyPoolJson) {
  this.keys = JSON.parse(keyPoolJson);
};

KeyPool.prototype = {
  getActiveKey: function (keyId) {
    var serviceKeys = this.keys;
    if (keyId) {
      serviceKeys = _.filter(serviceKeys, this._candidateKeyFilter(keyId));
    } else {
      keyId = 'key id not provided';
    }
    if (serviceKeys.length === 0) throw new KeyPoolError('key_not_found', 'Key not found for: ' + keyId);

    var candidateKeys = _.filter(serviceKeys, this._activeKeyFilter);
    if (candidateKeys.length === 0) throw new KeyPoolError('active_key_not_found', 'Active key not found for: ' + keyId);
    if (candidateKeys.length > 1) throw new KeyPoolError('ambiguous_active_key', 'Ambiguous active key for: ' + keyId);

    logger.log('activeKeyQuery', { request: keyId, served: candidateKeys[0].keyId });
    return _.pick(candidateKeys[0], ['keyId', 'secret']);
  },


  getKeyDb: function () {
    return function (keyId) {
      var key = _.find(this.keys, { keyId: keyId });
      logger.log('keyDbQuery', { request: keyId, found: !!key });
      return key ? key.secret : key;
    }.bind(this);
  },


  _candidateKeyFilter: function (keyId) {
    return function (key) {
      return key.keyId.startsWith(keyId);
    }
  },


  _activeKeyFilter: function (key) {
    return !key.acceptOnly;
  }

};

module.exports = KeyPool;
