'use strict';

var AutomationCenterAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI AutomationCenter endpoint', function() {
  describe('#programResource', function() {
    testApiMethod(AutomationCenterAPI, 'programResource').withArgs({ service_id: 12 }).shouldGetResultFromEndpoint('/programresource/service_id=12');
    testApiMethod(AutomationCenterAPI, 'programResource').withArgs({ service_id: 12, resource_id: 13 }).shouldGetResultFromEndpoint('/programresource/service_id=12&resource_id=13');
    testApiMethod(AutomationCenterAPI, 'programResource').withArgs({}).shouldThrowMissingParameterError('service_id');
    testApiMethod(AutomationCenterAPI, 'programResource').withArgs({ resource_id: 12 }).shouldThrowMissingParameterError('service_id');
  });

  describe('#programsEntrypoints', function() {
    testApiMethod(AutomationCenterAPI, 'programsEntrypoints')
      .withArgs({ node_type: 12 })
      .shouldThrowMissingParameterError('resource_id');

    testApiMethod(AutomationCenterAPI, 'programsEntrypoints')
      .withArgs({ resource_id: 12 })
      .shouldThrowMissingParameterError('node_type');

    testApiMethod(AutomationCenterAPI, 'programsEntrypoints')
      .withArgs({})
      .shouldThrowMissingParameterError('node_type', 'resource_id');

    testApiMethod(AutomationCenterAPI, 'programsEntrypoints')
      .withArgs({ node_type: 12, resource_id: 13, contact_id: 1 })
      .shouldPostToEndpoint('/ac/programs/entrypoints/12/resources/13/runs', {
        contact_id: 1
      });
  });
});
