'use strict';

var logger = require('logentries-logformat')('suite-sdk');


var Flipper = function(request) {
  this._request = request;
};

Flipper.prototype = {

  isOn: function(customerId, flipperId) {
    logger.log('flipper_isOn');
    return this._request.get('/customers/' + customerId + '/flippers/' + flipperId)
      .then(function(response) {
        return response.flipper.is_on;
      }.bind(this))
      .catch(function(error) {
        logger.log('flipper-error', { error: error, stack: error.stack });
        return false;
      });
  }

};

Flipper.create = function(request) {
  return new Flipper(request);
};

module.exports = Flipper;
