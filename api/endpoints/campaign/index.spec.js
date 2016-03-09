'use strict';

var CampaignAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI Campaign endpoint', function() {

  describe('#register', function() {
    var json = { 'name': 'testName', 'customer_id': '1', 'external_id': 'korte', 'provider': 'broadcast', 'campaign_type': 'batch', 'channel': 'push' };

    testApiMethod(CampaignAPI, 'register').withArgs(json).shouldPostToEndpoint('/campaigns', json);
  });

});
