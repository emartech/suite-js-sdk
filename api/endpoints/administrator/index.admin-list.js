'use strict';

var _ = require('lodash');


var AdminList = function(admins) {
  this._admins = admins;
};

AdminList.prototype = {

  getSuperadministrators: function() {
    return _.filter(this._admins, function(administrator) {
      return parseInt(administrator.superadmin) === 1;
    });
  },


  getFirstById: function(adminId) {
    return _.find(this._admins, function(administrator) {
      return administrator.id === adminId;
    });
  },


  getFirstByName: function(adminName) {
    return _.find(this._admins, function(administrator) {
      return administrator.username === adminName;
    });
  }

};

module.exports = AdminList;
