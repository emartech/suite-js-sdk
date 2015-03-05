'use strict';

var ContactAPI = require('./index');
var apiTest = require('../../../test-helper');

describe('Suite Contact', function() {

  apiTest.testSDKMethodResponse(ContactAPI, {
    create: {
      method: 'post',
      expectedUrl: '/contact',
      payload: { someData: 1 },
      expectedPayload: { someData: 1 }
    }
  });

});
