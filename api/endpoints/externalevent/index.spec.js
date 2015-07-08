'use strict';

var ExternalEventAPI = require('./');
var testApiMethod = require('../../../test-api-method');

describe('SuiteAPI External Event endpoint', function() {

  describe('#create', function() {

    testApiMethod(ExternalEventAPI, 'trigger').withArgs({
      event_id: 543,
      data: 'someData'
    }).shouldPostToEndpoint('/event/543/trigger', {
      data: 'someData'
    });

  });

});
