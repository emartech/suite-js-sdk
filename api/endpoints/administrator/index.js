'use strict';

var AdminList = require('./index.admin-list.js');
var SuiteRequestError = require('escher-suiteapi-js').Error;
var logger = require('logentries-logformat')('suite-sdk');
var passwordGenerator = require('../../../lib/password-generator');
var dateHelper = require('../../../lib/date-helper');
var _ = require('lodash');



var Administrator = function(request) {
  this._request = request;
};

Administrator.prototype = {

  getAdministrators: function(customerId) {
    logger.log('administrator_getAdministrators');
    return this._request.get(customerId, '/administrator');
  },


  getSuperadmin: function(customerId) {
    logger.log('administrator_getSuperadmin');
    return this.getAdministrators(customerId).then(function(response) {
      var firstSuperadmin = new AdminList(response).getFirstSuperadministrator();
      if (firstSuperadmin) return firstSuperadmin;

      throw new SuiteRequestError('There is no superadmin for this customer', 400);
    }.bind(this));
  },


  getAdministrator: function(customerId, adminId) {
    logger.log('administrator_getAdministrator');
    return this.getAdministrators(customerId).then(function(response) {
      var firstAdmin = new AdminList(response).getFirstById(adminId);
      if (firstAdmin) return firstAdmin;

      throw new SuiteRequestError('There is no admin for this customer', 400);
    }.bind(this));
  },


  getAdministratorByName: function(customerId, adminName) {
    logger.log('administrator_getAdministrator');
    return this.getAdministrators(customerId).then(function(response) {
      var firstAdmin = new AdminList(response).getFirstByName(adminName);
      if (firstAdmin) return firstAdmin;

      throw new SuiteRequestError('There is no admin for this customer', 400);
    }.bind(this));
  },


  getInterfaceLanguages: function(customerId) {
    logger.log('administrator_getInterfaceLanguages');
    return this._request.get(customerId, '/administrator/getinterfacelanguages');
  },


  getLanguages: function(customerId, language) {
    logger.log('administrator_getLanguages');
    if (!language) language = 'en';
    return this._request.get(customerId, '/language/translate/' + language);
  },


  getAccessLevels: function(customerId) {
    logger.log('administrator_getAccess');
    return this._request.get(customerId, '/administrator/getaccesslevels');
  },


  patchAdministrator: function(customerId, adminId, payload) {
    logger.log('administrator_patchAdministrator');
    return this._request.post(customerId, '/administrator/' + adminId + '/patch', payload);
  },


  createAdministrator: function(customerId, additionalDataToModify) {
    logger.log('admin_createAdmin');
    if (!additionalDataToModify) additionalDataToModify = {};

    var defaultValues = {
      password: this._generatePassword(),
      interface_language: 'en',
      access_level: 0,
      superadmin: 0,
      last_verification_action_date: dateHelper.getCurrentDate()
    };

    var dataToSend = _.extend({}, defaultValues, additionalDataToModify, {
      disabled: 1
    });

    return this._request.post(customerId, '/administrator/', dataToSend);
  },


  inviteExistingAdministrator: function(customerId, adminId, additionalDataToModify) {
    logger.log('admin_inviteExistingAdministrator');
    if (!additionalDataToModify) additionalDataToModify = {};

    var dataToSend = _.extend({}, additionalDataToModify, {
      disabled: 1,
      last_verification_action_date: dateHelper.getCurrentDate(),
      password: this._generatePassword()
    });

    return this.patchAdministrator(customerId, adminId, dataToSend);
  },


  createSuperadmin: function(customerId, additionalDataToModify) {
    var data = _.extend({}, additionalDataToModify, { superadmin: 1 });
    return this.createAdministrator(customerId, data);
  },


  promoteToSuperadmin: function(customerId, adminId, additionalDataToModify) {
    var data = _.extend({}, additionalDataToModify, {
      superadmin: 1,
      access_level: 0
    });
    return this.inviteExistingAdministrator(customerId, adminId, data);
  },


  enable: function(customerId, adminId, additionalDataToModify) {
    logger.log('admin_enable');
    if (!additionalDataToModify) additionalDataToModify = {};
    var dataToSend = _.extend({}, additionalDataToModify, {
      disabled: 0,
      last_verification_action_date: dateHelper.getCurrentDate()
    });

    return this.patchAdministrator(customerId, adminId, dataToSend);
  },


  disableAdministrator: function(customerId, adminId) {
    logger.log('admin_disable');

    return this.patchAdministrator(customerId, adminId, {
      disabled: 1,
      last_verification_action_date: dateHelper.getCurrentDate()
    });
  },


  deleteAdministrator: function(customerId, adminId, successorId) {
    logger.log('admin_delete');
    var payload = {
      administratorId: adminId,
      successor_administrator_id: successorId
    };

    return this._request.post(customerId, '/administrator/' + adminId + '/delete', payload);
  },


  _generatePassword: function() {
    return passwordGenerator.generate();
  }

};

Administrator.create = function(request) {
  return new Administrator(request);
};

module.exports = Administrator;
