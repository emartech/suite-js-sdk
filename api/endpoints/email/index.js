'use strict';

var util = require('util');
var _ = require('lodash');
var logger = require('logentries-logformat')('suite-sdk');

var Base = require('../_base');

var Email = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

var fetchFactory = function(payload, options, urlPattern, operationName) {
  return function() {
    var url = util.format(urlPattern, payload.email_id);
    logger.log(operationName);

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl(url, payload, ['email_id']),
      options
    );
  };
};

var createFactory = function(payload, options, urlPattern, operationName) {
  return function() {
    var url = util.format(urlPattern, payload.email_id);
    logger.log(operationName);

    return this._request.post(
      this._getCustomerId(options),
      url,
      this._cleanPayload(payload, ['email_id']),
      options
    );
  };
};

util.inherits(Email, Base);

_.extend(Email.prototype, {

  create: function(payload, options) {
    return this._requireParameters(payload, ['name', 'language'])
      .then(function() {
        return this._request.post(
          this._getCustomerId(options),
          '/email',
          payload,
          options
        );
      }.bind(this));
  },

  copy: function(payload, options) {
    return this._requireParameters(payload, ['email_id']).then(
      createFactory(payload, options, '/email/%s/copy', 'email_copy').bind(this)
    );
  },

  delete: function(payload, options) {
    return this._requireParameters(payload, ['emailId']).then(function() {
      logger.log('email_delete');

      return this._request.post(
        this._getCustomerId(options),
        '/email/delete',
        payload,
        options
      );
    }.bind(this));
  },

  createVersion: function(payload, options) {
    return this._requireParameters(payload, ['email_id']).then(
      createFactory(payload, options, '/email/%s/versions', 'email_versions').bind(this)
    );
  },

  renameVersion: function(payload, options) {
    return this._requireParameters(payload, ['email_id', 'version_id']).then(function() {
      logger.log('rename_email_version');

      return this._request.post(
        this._getCustomerId(options),
        util.format('/email/%s/versions/%s', payload.email_id, payload.version_id),
        this._cleanPayload(payload, ['email_id', 'version_id']),
        options
      );
    }.bind(this));
  },

  updateSource: function(payload, options) {
    return this._requireParameters(payload, ['email_id']).then(function() {
      logger.log('email_update_source');

      return this._request.post(
        this._getCustomerId(options),
        util.format('/email/%s/updatesource', payload.email_id),
        this._cleanPayload(payload, ['email_id']),
        options
      );
    }.bind(this));
  },


  list: function(payload, options) {
    logger.log('email_list');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/email', payload),
      options
    );
  },

  listVersions: function(payload, options) {
    return this._requireParameters(payload, ['email_id']).then(
      fetchFactory(payload, options, '/email/%s/versions', 'email_list_versions').bind(this)
    );
  },


  getResponseSummary: function(payload, options) {
    return this._requireParameters(payload, ['email_id']).then(
      fetchFactory(payload, options, '/email/%s/responsesummary', 'email_get_response_summary').bind(this)
    );
  },


  get: function(payload, options) {
    return this._requireParameters(payload, ['email_id']).then(
      fetchFactory(payload, options, '/email/%s', 'email_get').bind(this)
    );
  },


  patch: function(payload, options) {
    return this._requireParameters(payload, ['email_id']).then(function() {
      logger.log('email_patch');

      return this._request.post(
        this._getCustomerId(options),
        util.format('/email/%s/patch', payload.email_id),
        this._cleanPayload(payload, ['email_id']),
        options
      );
    }.bind(this));
  },


  sendTestMail: function(payload, options) {
    return this._requireParameters(payload, ['email_id']).then(function() {
      logger.log('email_send_test_mail');

      return this._request.post(
        this._getCustomerId(options),
        util.format('/email/%s/sendtestmail', payload.email_id),
        this._cleanPayload(payload, ['email_id']),
        options
      );
    }.bind(this));
  },


  launch: function(payload, options) {
    return this._requireParameters(payload, ['email_id']).then(function() {
      logger.log('email_launch');

      return this._request.post(
        this._getCustomerId(options),
        util.format('/email/%s/launch', payload.email_id),
        this._cleanPayload(payload, ['email_id']),
        options
      );
    }.bind(this));
  },


  getPersonalizations: function(payload, options) {
    return this._requireParameters(payload, ['email_id']).then(function() {
      logger.log('email_get_personalizations');

      return this._request.get(
        this._getCustomerId(options),
        util.format('/email/%s/personalization', payload.email_id),
        options
      );
    }.bind(this));
  },


  setPersonalizations: function(payload, options) {
    return this._requireParameters(payload, ['email_id']).then(function() {
      logger.log('email_post_personalizations');

      return this._request.post(
        this._getCustomerId(options),
        util.format('/email/%s/personalization', payload.email_id),
        payload.data,
        options
      );
    }.bind(this));
  },

  createTrackedLink: function(payload, options) {
    return this._requireParameters(payload, ['email_id', 'section_id', 'url']).then(function() {
      logger.log('email_post_createTrackedLinks');

      return this._request.post(
        this._getCustomerId(options),
        util.format('/email/%s/trackedlinks', payload.email_id),
        this._cleanPayload(payload, ['email_id']),
        options
      );
    }.bind(this));
  },

  getTrackedLinks: function(payload, options) {
    return this._requireParameters(payload, ['email_id']).then(function() {
      logger.log('email_get_getTrackedLinks');

      var url = payload.link_id ?
        util.format('/email/%s/trackedlinks/%s', payload.email_id, payload.link_id) :
        util.format('/email/%s/trackedlinks', payload.email_id);

      return this._request.get(
        this._getCustomerId(options),
        this._buildUrl(url, payload, ['email_id', 'link_id']),
        options
      );
    }.bind(this));
  },

  updateTrackedLink: function(payload, options) {
    return this._requireParameters(payload, ['email_id', 'link_id', 'url']).then(function() {
      logger.log('email_post_updateTrackedLinks');

      return this._request.post(
        this._getCustomerId(options),
        util.format('/email/%s/trackedlinks/%s', payload.email_id, payload.link_id),
        this._cleanPayload(payload, ['email_id', 'link_id']),
        options
      );
    }.bind(this));
  },

  deleteTrackedLinks: function(payload, options) {
    return this._requireParameters(payload, ['email_id']).then(function() {
      logger.log('email_post_deleteTrackedLinks');

      var url = payload.link_id ?
        util.format('/email/%s/deletetrackedlinks/%s', payload.email_id, payload.link_id) :
        util.format('/email/%s/deletetrackedlinks', payload.email_id);

      return this._request.post(
        this._getCustomerId(options),
        url,
        this._cleanPayload(payload, ['email_id', 'link_id']),
        options
      );
    }.bind(this));
  },

  deleteTrackedLinksBySource: function(payload, options) {
    return this._requireParameters(payload, ['email_id', 'source']).then(function() {
      return this.deleteTrackedLinks({ email_id: payload.email_id, link_id: payload.source }, options);
    }.bind(this));
  },

  launchList: function(payload, options) {
    return this._requireParameters(payload, ['emailId']).then(function() {
      logger.log('email_getlaunchesofemail');

      return this._request.post(
        this._getCustomerId(options),
        '/email/getlaunchesofemail',
        this._cleanPayload(payload),
        options
      );
    }.bind(this));
  },

  getDeliveryStatus: function(payload, options) {
    return this._requireParameters(payload, ['emailId']).then(function() {
      logger.log('email_getdeliverystatus');

      return this._request.post(
        this._getCustomerId(options),
        '/email/getdeliverystatus',
        this._cleanPayload(payload),
        options
      );
    }.bind(this));
  },

  responses: function(payload, options) {
    return this._requireParameters(payload, ['type']).then(function() {
      logger.log('email_responses');

      return this._request.post(
        this._getCustomerId(options),
        '/email/responses',
        this._cleanPayload(payload),
        options
      );
    }.bind(this));
  },

  getContacts: function(payload, options) {
    logger.log('email_getcontacts');

    return this._request.post(
      this._getCustomerId(options),
      '/email/getcontacts',
      this._cleanPayload(payload),
      options
    );
  },

  listPrograms: function(payload, options) {
    return this._requireParameters(payload, ['email_id']).then(
      fetchFactory(payload, options, '/email/%s/programs', 'email_list_programs').bind(this)
    );
  }
});


Email.create = function(request, options) {
  return new Email(request, options);
};

module.exports = Email;
