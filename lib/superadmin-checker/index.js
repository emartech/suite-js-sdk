'use strict';

var SuiteApi = require('../../api');

var Checker = function(requestId) {
  this._suiteApi = (requestId) ? SuiteApi.createWithCache(requestId) : SuiteApi.create();
};


Checker.prototype = {

  isSuperadmin: function* (customerId, adminId) {
    var admin = yield this._suiteApi.administrator.getAdministrator(customerId, adminId);
    return !!admin.superadmin;
  }

};


Checker.create = function(requestId) {
  return new Checker(requestId);
};


module.exports = {

  isSuperadmin: function* (customerId, adminId, requestId) {
    return yield Checker
                  .create(requestId)
                  .isSuperadmin(customerId, adminId);
  }

};
