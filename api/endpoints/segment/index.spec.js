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

  describe('#countContacts', function() {
    testApiMethod(SegmentAPI, 'countContacts').withArgs({
      segment_id: 10
    }).shouldGetResultFromEndpoint('/filter/10/contacts/count');

    testApiMethod(SegmentAPI, 'countContacts').shouldThrowMissingParameterError('segment_id');
  });

  describe('#create', function() {

    testApiMethod(SegmentAPI, 'create').withArgs({
      name: 'new segment'
    }).shouldPutToEndpoint('/filter', {
      name: 'new segment'
    });

    testApiMethod(SegmentAPI, 'create').withArgs({
      name: 'new segment with contact criteria',
      description: 'segment description',
      contactCriteria: {
        type: 'criteria',
        field: 'address',
        operator: 'not_empty',
        value: ''
      }
    }).shouldPutToEndpoint('/filter', {
      name: 'new segment with contact criteria',
      description: 'segment description',
      contactCriteria: {
        type: 'criteria',
        field: 'address',
        operator: 'not_empty',
        value: ''
      }
    });

  });

  describe('#getContactCriteria', function() {
    testApiMethod(SegmentAPI, 'getContactCriteria').withArgs({
      segment_id: 10
    }).shouldGetResultFromEndpoint('/filter/10/contact_criteria');

    testApiMethod(SegmentAPI, 'getContactCriteria').shouldThrowMissingParameterError('segment_id');
  });

  describe('#updateContactCriteria', function() {
    testApiMethod(SegmentAPI, 'updateContactCriteria').withArgs({
      segment_id: 10,
      contact_criteria: {
        type: 'criteria',
        field: 'address',
        operator: 'not_empty',
        value: ''
      }
    }).shouldPutToEndpoint('/filter/10/contact_criteria', {
      type: 'criteria',
      field: 'address',
      operator: 'not_empty',
      value: ''
    });

    testApiMethod(SegmentAPI, 'updateContactCriteria').shouldThrowMissingParameterError('segment_id');
  });

});
