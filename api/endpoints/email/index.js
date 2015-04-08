'use strict';

var util = require('util');
var logger = require('logentries-logformat')('suite-sdk');

var Email = function (request) {
  this._request = request;
};

Email.prototype.copy = function (customerId, emailId, payload) {
  logger.log('email_copy');
  return this._request.post(customerId, util.format('/email/%s/copy', emailId), payload);
};

Email.create = function (request) {
  return new Email(request);
};

module.exports = Email;
