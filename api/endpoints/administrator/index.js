'use strict';

var util = require('util');
var _ = require('lodash');

const { createLogger } = require('@emartech/json-logger');
const logger = createLogger('suite-sdk');

var AdminList = require('./index.admin-list.js');
var SuiteRequestError = require('../../../lib/api-request/error');
var passwordGenerator = require('../../../lib/password-generator');
var dateHelper = require('../../../lib/date-helper');

var Base = require('../_base');

var Administrator = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(Administrator, Base);

_.extend(Administrator.prototype, {

  getAdministrators: function(payload, options) {
    logger.info('administrator_get_administrators');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/administrator', payload),
      options
    );
  },


  getSuperadmins: function(payload, options) {
    logger.info('administrator_get_superadmins');

    return this.getAdministrators(payload, options).then(function(response) {
      var superadmins = new AdminList(response.body.data).getSuperadministrators();

      if (superadmins) {
        return Promise.resolve({
          body: {
            data: superadmins
          }
        });
      }

      return Promise.reject(new SuiteRequestError('There is no admin for this customer', 400));
    }.bind(this));
  },


  getAdministrator: function(payload, options) {
    return this._requireParameters(payload, ['administrator_id']).then(function() {
      logger.info('administrator_get_administrator');

      var administratorId = payload.administrator_id;
      payload = this._cleanPayload(payload, ['administrator_id']);

      return this._request.get(
        this._getCustomerId(options),
        this._buildUrl(`/administrator/${administratorId}`, payload),
        options
      );
    }.bind(this));
  },


  getAdministratorByName: function(payload, options) {
    return this._requireParameters(payload, ['admin_name']).then(function() {
      logger.info('administrator_get_administrator_by_name');

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
    logger.info('administrator_get_interface_languages');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/administrator/getinterfacelanguages', payload),
      options
    );
  },


  getStartPages: function(payload, options) {
    logger.info('administrator_get_start_pages');

    return this._request.get(
      this._getCustomerId(options),
      util.format('/administrator/getstartpages'),
      options
    );
  },


  getRestrictedStartPages: function(payload, options) {
    return this._requireParameters(payload, ['administrator_id']).then(() => {
      logger.info('administrator_get_restricted_start_pages');

      return this._request.get(
        this._getCustomerId(options),
        util.format('/administrator/%s/getstartpages', payload.administrator_id),
        options
      );
    });
  },


  getLanguages: function(customerId, language, options) {
    logger.info('administrator_getLanguages');
    if (!language) {
      language = 'en';
    }
    return this._request.get(customerId, '/language/translate/' + language, options);
  },


  getAccessLevels: function(payload, options) {
    logger.info('administrator_get_access_levels');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/administrator/getaccesslevels', payload),
      options
    );
  },


  patchAdministrator: function(payload, options) {
    return this._requireParameters(payload, ['administrator_id']).then(function() {
      logger.info('administrator_patch_administrator');

      return this._request.post(
        this._getCustomerId(options),
        util.format('/administrator/%s/patch', payload.administrator_id),
        this._cleanPayload(payload, ['administrator_id']),
        options
      );
    }.bind(this));
  },



  createAdministrator: function(payload, options) {
    logger.info('admin_create_administrator');
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
    logger.info('admin_invite_existing_administrator');

    payload = _.extend({}, payload, {
      last_invitation_action_date: dateHelper.getCurrentDate()
    });

    return this.patchAdministrator(payload, options);
  },


  createSuperadmin: function(payload, options) {
    logger.info('admin_create_superadmin');

    return this.createAdministrator(
      _.extend({}, payload, {
        superadmin: 1
      }),
      options
    );
  },


  promoteToSuperadmin: function(payload, options) {
    logger.info('admin_promote_superadmin');

    payload = _.extend({}, payload, {
      superadmin: 1
    });

    return this.inviteExistingAdministrator(payload, options);
  },


  enableAdministrator: function(payload, options) {
    logger.info('admin_enable');

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
    logger.info('admin_disable');

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
      logger.info('admin_delete');

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
