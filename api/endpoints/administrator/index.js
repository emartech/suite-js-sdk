'use strict';

var AdminList = require('./index.admin-list.js');
var SuiteRequestError = require('escher-suiteapi-js').Error;
var logger = require('logentries-logformat')('suite-sdk');
var passwordGenerator = require('../../../lib/password-generator');
var dateHelper = require('../../../lib/date-helper');
var _ = require('lodash');



var Administrator = function(request, options) {
  this._request = request;
  this.customerId = options.customerId;
};

Administrator.prototype = {

  getAdministrators: function(options) {
    logger.log('administrator_getAdministrators');
    return this._request.get(this._getCustomerId(options), '/administrator', options);
  },


  getSuperadmin: function(customerId, options) {
    logger.log('administrator_getSuperadmin');
    return this.getAdministrators(customerId, options).then(function(response) {
      var firstSuperadmin = new AdminList(response).getFirstSuperadministrator();
      if (firstSuperadmin) return firstSuperadmin;

      throw new SuiteRequestError('There is no superadmin for this customer', 400);
    }.bind(this));
  },


  getAdministrator: function(customerId, adminId, options) {
    logger.log('administrator_getAdministrator');
    return this.getAdministrators(customerId, options).then(function(response) {
      var firstAdmin = new AdminList(response).getFirstById(adminId);
      if (firstAdmin) return firstAdmin;

      throw new SuiteRequestError('There is no admin for this customer', 400);
    }.bind(this));
  },


  getAdministratorByName: function(customerId, adminName, options) {
    logger.log('administrator_getAdministrator');
    return this.getAdministrators(customerId, options).then(function(response) {
      var firstAdmin = new AdminList(response).getFirstByName(adminName);
      if (firstAdmin) return firstAdmin;

      throw new SuiteRequestError('There is no admin for this customer', 400);
    }.bind(this));
  },


  getInterfaceLanguages: function(customerId, options) {
    logger.log('administrator_getInterfaceLanguages');
    return this._request.get(customerId, '/administrator/getinterfacelanguages', options);
  },


  getLanguages: function(customerId, language, options) {
    logger.log('administrator_getLanguages');
    if (!language) language = 'en';
    return this._request.get(customerId, '/language/translate/' + language, options);
  },


  getAccessLevels: function(customerId, options) {
    logger.log('administrator_getAccess');
    return this._request.get(customerId, '/administrator/getaccesslevels', options);
  },


  patchAdministrator: function(customerId, adminId, payload, options) {
    logger.log('administrator_patchAdministrator');
    return this._request.post(customerId, '/administrator/' + adminId + '/patch', payload, options);
  },


  createAdministrator: function(customerId, additionalDataToModify, options) {
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

    return this._request.post(customerId, '/administrator/', dataToSend, options);
  },


  inviteExistingAdministrator: function(customerId, adminId, additionalDataToModify, options) {
    logger.log('admin_inviteExistingAdministrator');
    if (!additionalDataToModify) additionalDataToModify = {};

    var dataToSend = _.extend({}, additionalDataToModify, {
      disabled: 1,
      last_verification_action_date: dateHelper.getCurrentDate(),
      password: this._generatePassword()
    });

    return this.patchAdministrator(customerId, adminId, dataToSend, options);
  },


  createSuperadmin: function(customerId, additionalDataToModify, options) {
    var data = _.extend({}, additionalDataToModify, { superadmin: 1 });
    return this.createAdministrator(customerId, data, options);
  },


  promoteToSuperadmin: function(customerId, adminId, additionalDataToModify, options) {
    var data = _.extend({}, additionalDataToModify, {
      superadmin: 1,
      access_level: 0
    });
    return this.inviteExistingAdministrator(customerId, adminId, data, options);
  },


  enable: function(customerId, adminId, additionalDataToModify, options) {
    logger.log('admin_enable');
    if (!additionalDataToModify) additionalDataToModify = {};
    var dataToSend = _.extend({}, additionalDataToModify, {
      disabled: 0,
      last_verification_action_date: dateHelper.getCurrentDate()
    });

    return this.patchAdministrator(customerId, adminId, dataToSend, options);
  },


  disableAdministrator: function(customerId, adminId, options) {
    logger.log('admin_disable');

    return this.patchAdministrator(customerId, adminId, {
      disabled: 1,
      last_verification_action_date: dateHelper.getCurrentDate()
    }, options);
  },


  deleteAdministrator: function(customerId, adminId, successorId, options) {
    logger.log('admin_delete');
    var payload = {
      administratorId: adminId,
      successor_administrator_id: successorId
    };

    return this._request.post(customerId, '/administrator/' + adminId + '/delete', payload, options);
  },

  _getCustomerId: function (options) {
    options = options || {};
    return options.customerId || this.customerId;
  },

  _generatePassword: function() {
    return passwordGenerator.generate();
  }

};

Administrator.create = function(request, options) {
  options = options || {};
  return new Administrator(request, options);
};

module.exports = Administrator;
