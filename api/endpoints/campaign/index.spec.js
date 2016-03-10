'use strict';

var CampaignAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI Campaign endpoint', function() {

  describe('#create', function() {
    var json = { 'name': 'testName', 'customer_id': '1', 'external_id': 'korte', 'provider': 'broadcast', 'campaign_type': 'batch', 'channel': 'push' };

    testApiMethod(CampaignAPI, 'create').withArgs(json).shouldPostToEndpoint('/campaigns', json);
  });

});
