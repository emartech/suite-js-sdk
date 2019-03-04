'use strict';

var SuiteApi = require('../../api');

var Checker = function(requestId) {
  this._suiteApi = (requestId) ? SuiteApi.createWithCache(requestId) : SuiteApi.create();
};


Checker.prototype = {

  isSuperadmin: function* (customerId, adminId) {
    var admin = yield this._suiteApi.administrator.getAdministrator({ administrator_id: adminId },
      { customerId: customerId });

    return !!admin.body.data.superadmin;
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
