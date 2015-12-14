'use strict';

var SegmentAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI Segment endpoint', function() {

  describe('#listSegments', function() {
    testApiMethod(SegmentAPI, 'listSegments').withArgs({}).shouldGetResultFromEndpoint('/filter');
  });

  describe('#listContacts', function() {
    testApiMethod(SegmentAPI, 'listContacts').withArgs({
      segment_id: 10,
      limit: 100
    }).shouldGetResultFromEndpoint('/filter/10/contacts/limit=100');

    testApiMethod(SegmentAPI, 'listContacts').withArgs({
      segment_id: 10,
      limit: 100,
      offset: 0
    }).shouldGetResultFromEndpoint('/filter/10/contacts/limit=100&offset=0');

    testApiMethod(SegmentAPI, 'listContacts').withArgs({ limit: 100 }).shouldThrowMissingParameterError('segment_id');

    testApiMethod(SegmentAPI, 'listContacts').withArgs({ segment_id: 10 }).shouldThrowMissingParameterError('limit');
  });

});
