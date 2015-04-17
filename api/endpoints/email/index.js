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

Email.prototype.updateSource = function (customerId, emailId, payload) {
  logger.log('email_update_source');
  return this._request.post(customerId, util.format('/email/%s/updatesource', emailId), payload);
};

Email.prototype.list = function (customerId) {
  logger.log('email_list');
  return this._request.get(customerId, '/email');
};

Email.prototype.launch = function (customerId, emailId, schedule, timezone) {
  logger.log('email_launch');
  return this._request.post(customerId, util.format('/email/%s/launch', emailId), {
    schedule: schedule,
    timezone: timezone
  });
};

Email.create = function (request) {
  return new Email(request);
};

module.exports = Email;
