'use strict';

var util = require('util');
var logger = require('logentries-logformat')('suite-sdk');
var _ = require('lodash');

var AdminList = require('./index.admin-list.js');
var SuiteRequestError = require('escher-suiteapi-js').Error;
var passwordGenerator = require('../../../lib/password-generator');
var dateHelper = require('../../../lib/date-helper');
var Promise = require('bluebird');

var Base = require('../_base');

var Administrator = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(Administrator, Base);

_.extend(Administrator.prototype, {

  getAdministrators: function(payload, options) {
    logger.log('administrator_get_administrators');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/administrator', payload),
      options
    );
  },


  getSuperadmin: function(payload, options) {
    logger.log('administrator_get_superadmin');

    return this.getAdministrators(payload, options).then(function(response) {
      var firstAdmin = new AdminList(response.body.data).getFirstSuperadministrator();

      if (firstAdmin) {
        return Promise.resolve({
          body: {
            data: firstAdmin
          }
        });
      }

      return Promise.reject(new SuiteRequestError('There is no admin for this customer', 400));
    }.bind(this));
  },


  getAdministrator: function(payload, options) {
    return this._requireParameters(payload, ['administrator_id']).then(function() {
      logger.log('administrator_get_administrator');

      var administratorId = payload.administrator_id;
      payload = this._cleanPayload(payload, ['administrator_id']);

      return this.getAdministrators(payload, options).then(function(response) {
        var firstAdmin = new AdminList(response.body.data).getFirstById(administratorId);

        if (firstAdmin) {
          return Promise.resolve({
            body: {
              data: firstAdmin
            }
          });
        }

        return Promise.reject(new SuiteRequestError('There is no admin for this customer', 400));
      }.bind(this));
    }.bind(this));
  },


  getAdministratorByName: function(payload, options) {
    return this._requireParameters(payload, ['admin_name']).then(function() {
      logger.log('administrator_get_administrator_by_name');

      var adminName = payload.admin_name;
      payload = this._cleanPayload(payload, ['admin_name']);

      return this.getAdministrators(payload, options).then(function(response) {
        var firstAdmin = new AdminList(response.body.data).getFirstByName(adminName);

        if (firstAdmin) {
          return Promise.resolve({
            body: {
              data: firstAdmin
            }
          });
        }

        return Promise.reject(new SuiteRequestError('There is no admin for this customer', 400));
      }.bind(this));
    }.bind(this));
  },


  getInterfaceLanguages: function(payload, options) {
    logger.log('administrator_get_interface_languages');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/administrator/getinterfacelanguages', payload),
      options
    );
  },


  getLanguages: function(customerId, language, options) {
    logger.log('administrator_getLanguages');
    if (!language) {
      language = 'en';
    }
    return this._request.get(customerId, '/language/translate/' + language, options);
  },


  getAccessLevels: function(payload, options) {
    logger.log('administrator_get_access_levels');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/administrator/getaccesslevels', payload),
      options
    );
  },


  patchAdministrator: function(payload, options) {
    return this._requireParameters(payload, ['administrator_id']).then(function() {
      logger.log('administrator_patch_administrator');

      return this._request.post(
        this._getCustomerId(options),
        util.format('/administrator/%s/patch', payload.administrator_id),
        this._cleanPayload(payload, ['administrator_id']),
        options
      );
    }.bind(this));
  },



  createAdministrator: function(payload, options) {
    logger.log('admin_create_administrator');
    if (!payload) {
      payload = {};
    }

    var defaultValues = {
      password: passwordGenerator.generate(),
      interface_language: 'en',
      access_level: 0,
      superadmin: 0,
      last_invitation_action_date: dateHelper.getCurrentDate()
    };

    payload = _.extend({}, defaultValues, payload, {
      disabled: 1
    });

    return this._request.post(
      this._getCustomerId(options),
      '/administrator',
      payload,
      options
    );
  },


  inviteExistingAdministrator: function(payload, options) {
    logger.log('admin_invite_existing_administrator');

    payload = _.extend({}, payload, {
      disabled: 1,
      last_invitation_action_date: dateHelper.getCurrentDate(),
      password: passwordGenerator.generate()
    });

    return this.patchAdministrator(payload, options);
  },


  createSuperadmin: function(payload, options) {
    logger.log('admin_create_superadmin');

    return this.createAdministrator(
      _.extend({}, payload, {
        superadmin: 1
      }),
      options
    );
  },


  promoteToSuperadmin: function(payload, options) {
    logger.log('admin_promote_superadmin');

    payload = _.extend({}, payload, {
      superadmin: 1,
      access_level: 0
    });

    return this.inviteExistingAdministrator(payload, options);
  },


  enableAdministrator: function(payload, options) {
    logger.log('admin_enable');

    if (!payload) {
      payload = {};
    }

    payload = _.extend({}, payload, {
      disabled: 0,
      last_verification_action_date: dateHelper.getCurrentDate()
    });

    return this.patchAdministrator(payload, options);
  },


  disableAdministrator: function(payload, options) {
    logger.log('admin_disable');

    if (!payload) {
      payload = {};
    }

    payload = _.extend({}, payload, {
      disabled: 1
    });

    return this.patchAdministrator(payload, options);
  },


  deleteAdministrator: function(payload, options) {
    return this._requireParameters(payload, ['administrator_id', 'successor_administrator_id']).then(function() {
      logger.log('admin_delete');

      return this._request.post(
        this._getCustomerId(options),
        util.format('/administrator/%s/delete', payload.administrator_id),
        this._cleanPayload(payload, ['administrator_id']),
        options);
    }.bind(this));
  }

});

Administrator.create = function(request, options) {
  return new Administrator(request, options);
};

module.exports = Administrator;
