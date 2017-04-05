'use strict';

var util = require('util');
var _ = require('lodash');
var logger = require('logentries-logformat')('suite-sdk');

var Base = require('../_base');

var MediaDB = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(MediaDB, Base);

_.extend(MediaDB.prototype, {

  createFolder: function(payload, options) {
    return this._requireParameters(payload, ['name', 'parent']).then(function() {
      logger.log('folder_create');

      return this._request.post(
        this._getCustomerId(options),
        '/folder',
        payload,
        options
      );
    }.bind(this));
  }

});

MediaDB.create = function(request, options) {
  return new MediaDB(request, options);
};

module.exports = MediaDB;
