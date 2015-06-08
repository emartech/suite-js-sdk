'use strict';

var logger = require('logentries-logformat')('suite-sdk');
var util = require('util');

var SmartInsight = function(request) {
  this._request = request;
};

SmartInsight.prototype = {

  getPurchases: function(customerId, startDate, endDate, offset, limit, options) {
    var url = util.format('/purchases?start_date=%s&end_date=%s&offset=%s&limit=%s', startDate, endDate, offset, limit);
    logger.log('smart_insight_get_purchases');
    return this._request.get(customerId, url, options);
  }

};

SmartInsight.create = function(request) {
  return new SmartInsight(request);
};

module.exports = SmartInsight;
