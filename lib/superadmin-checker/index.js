'use strict';

var SuiteApi = require('../../api');

var Checker = function(requestId) {
  this._suiteApi = requestId ?
    SuiteApi.createWithCache(requestId) :
    SuiteApi.create();
};

Checker.prototype = {
  isSuperadmin: async function(customerId, adminId) {
    var admin = await this._suiteApi.administrator.getAdministrator(
      { administrator_id: adminId },
      { customerId: customerId }
    );

    return !!admin.body.data.superadmin;
  }
};

Checker.create = function(requestId) {
  return new Checker(requestId);
};

module.exports = {
  isSuperadmin: async function(customerId, adminId, requestId) {
    return await Checker.create(requestId).isSuperadmin(customerId, adminId);
  }
};
