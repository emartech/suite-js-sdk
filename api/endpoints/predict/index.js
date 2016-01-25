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
  },


  hideWidget: function(payload, options) {
    return this._requireParameters(payload, ['widget_id']).then(function() {
      return this._sendToggleRequest(payload, options, 'hide');
    }.bind(this));
  },


  showWidget: function(payload, options) {
    return this._requireParameters(payload, ['widget_id']).then(function() {
      return this._sendToggleRequest(payload, options, 'show');
    }.bind(this));
  },


  _sendToggleRequest: function(payload, options, visibilityAction) {
    logger.log('predict_toggle_widget');
    return this._request.post(
      this._getCustomerId(options),
      util.format('/predict/%s/%s', payload.widget_id, visibilityAction),
      this._cleanPayload(payload, ['widget_id']),
      options
    );
  }

});

Predict.create = function(request, options) {
  return new Predict(request, options);
};

module.exports = Predict;
