'use strict';

var SegmentAPI = require('./');
var testApiMethod = require('../../../test-api-method');

describe('SuiteAPI Segment endpoint', function() {

  describe('#listSegments', function() {
    testApiMethod(SegmentAPI, 'listSegments').withArgs({}).shouldGetResultFromEndpoint('/filter');
  });


  describe('#listContacts', function() {
    testApiMethod(SegmentAPI, 'listContacts').withArgs({
      segmentId: 10
    }).shouldGetResultFromEndpoint('/filter/10/contacts');

    testApiMethod(SegmentAPI, 'listContacts').withArgs({
      segmentId: 10,
      limit: 100,
      offset: 0
    }).shouldGetResultFromEndpoint('/filter/10/contacts/?limit=100&offset=0');

    testApiMethod(SegmentAPI, 'listContacts').withArgs({}).shouldThrowMissingParameterError('segmentId');
  });

});
