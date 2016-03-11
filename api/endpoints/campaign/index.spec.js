'use strict';

var CampaignAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI Campaign endpoint', function() {

  describe('#create', function() {
    var json = { 'name': 'testName', 'customer_id': '1', 'external_id': '5', 'provider': 'emarsys', 'campaign_type': 'batch', 'channel': 'push' };

    testApiMethod(CampaignAPI, 'create').withArgs(json).shouldPostToEndpoint('/campaigns', json);
  });

  describe('#update', function() {
    var json = { 'id': 1, 'name': 'testName2', 'customer_id': '1', 'external_id': '5', 'provider': 'emarsys', 'campaign_type': 'batch', 'channel': 'push' };

    testApiMethod(CampaignAPI, 'update').withArgs(json).shouldPostToEndpoint('/campaigns/1', json);

    testApiMethod(CampaignAPI, 'update').withArgs({}).shouldThrowMissingParameterError('id');
  });

});
