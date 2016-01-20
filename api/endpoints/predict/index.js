'use strict';

var util = require('util');
var _ = require('lodash');
var Base = require('../_base');
var logger = require('logentries-logformat')('suite-sdk');

var Predict = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(Predict, Base);

_.extend(Predict.prototype, {

  listWidgets: function(payload, options) {
    logger.log('predict_list_widgets');
    return this._request.get(this._getCustomerId(options), '/predict', options);
  }

});

Predict.create = function(request, options) {
  return new Predict(request, options);
};

module.exports = Predict;
