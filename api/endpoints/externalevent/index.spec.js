'use strict';

var ExternalEventAPI = require('./index');
var apiTest = require('../../../test-helper');

describe('Suite External Event', function() {

  apiTest.testSDKMethodResponse(ExternalEventAPI, {
    trigger: {
      method: 'post',
      expectedUrl: '/event/543/trigger',
      arguments: [543],
      payload: { someData: 1 },
      expectedPayload: { someData: 1 }
    }
  });

});
