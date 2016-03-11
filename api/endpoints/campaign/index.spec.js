'use strict';

var CampaignAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI Campaign endpoint', function() {

  describe('#create', function() {

    testApiMethod(CampaignAPI, 'create').withArgs({
      name: 'testName',
      customer_id: '1',
      external_id: '5',
      provider: 'emarsys',
      campaign_type: 'batch',
      channel: 'push'
    }).shouldPostToEndpoint('/campaigns', {
      name: 'testName',
      customer_id: '1',
      external_id: '5',
      provider: 'emarsys',
      campaign_type: 'batch',
      channel: 'push'
    });
  });

  describe('#update', function() {

    testApiMethod(CampaignAPI, 'update').withArgs({
      campaign_id: 1,
      name: 'testName2',
      customer_id: '1',
      external_id: '5',
      provider: 'emarsys',
      campaign_type: 'batch',
      channel: 'push'
    }).shouldPostToEndpoint('/campaigns/1', {
      name: 'testName2',
      customer_id: '1',
      external_id: '5',
      provider: 'emarsys',
      campaign_type: 'batch',
      channel: 'push'
    });

    testApiMethod(CampaignAPI, 'update').withArgs({}).shouldThrowMissingParameterError('campaign_id');
  });

});
