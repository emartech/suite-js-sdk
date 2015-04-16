'use strict';

var util = require('util');
var logger = require('logentries-logformat')('suite-sdk');

var OFFSET = 0;
var LIMIT = 1000000;

var Segment = function (request) {
  this._request = request;
};

Segment.prototype.listContacts = function (customerId, segmentId, offset, limit) {
  offset = offset || OFFSET;
  limit = limit || LIMIT;
  var url = util.format('/filter/%s/contacts/limit=%s&offset=%s', segmentId, limit, offset);
  logger.log('segment_list_contacts');
  return this._request.get(customerId, url);
};

Segment.prototype.listSegments = function (customerId) {
  var url = '/filter';
  logger.log('segment_list');
  return this._request.get(customerId, url);
};

Segment.create = function (request) {
  return new Segment(request);
};

module.exports = Segment;
