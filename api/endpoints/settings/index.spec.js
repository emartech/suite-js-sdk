'use strict';

var SettingsAPI = require('./');
var apiTest = require('../../../test-helper');

describe.skip('SuiteAPI Settings endpoint', function() {

  apiTest.testSDKMethodResponse(SettingsAPI, {
    getCorporateDomains: {
      method: 'get',
      expectedUrl: '/settings/corporatedomain'
    },

    getSettings: {
      method: 'get',
      expectedUrl: '/settings'
    },

    setCorporateDomains: {
      method: 'put',
      expectedUrl: '/settings/corporatedomain',
      payload: ['domain1.com', 'domain2.com'],
      expectedPayload: { domains: ['domain1.com', 'domain2.com'] }
    }
  });

});
