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
});
