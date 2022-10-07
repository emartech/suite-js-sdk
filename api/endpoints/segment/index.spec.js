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

  describe('#getSegment', function() {
    testApiMethod(SegmentAPI, 'getSegment').withArgs({
      segment_id: 10
    }).shouldGetResultFromEndpoint('/filter/10');

    testApiMethod(SegmentAPI, 'getSegment').shouldThrowMissingParameterError('segment_id');
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

  describe('#runForSingleContact', function() {
    const segmentId = 11223344;
    testApiMethod(SegmentAPI, 'runForSingleContact').withArgs({
      segment_id: segmentId
    }).shouldPostToEndpoint(`/filter/${segmentId}/single_runs`, {});

    testApiMethod(SegmentAPI, 'runForSingleContact').shouldThrowMissingParameterError('segment_id');
  });

  describe('#singleContactRunStatus', function() {
    const runId = 'affe-dead';
    testApiMethod(SegmentAPI, 'singleContactRunStatus').withArgs({
      run_id: runId
    }).shouldGetResultFromEndpoint(`/filter/single_runs/${runId}`);

    testApiMethod(SegmentAPI, 'singleContactRunStatus').shouldThrowMissingParameterError('run_id');
  });

  describe('#runForMultipleContacts', function() {
    testApiMethod(SegmentAPI, 'runForMultipleContacts').withArgs({
      segment_id: 8362723
    }).shouldPostToEndpoint('/filter/8362723/runs', {});

    testApiMethod(SegmentAPI, 'runForMultipleContacts').shouldThrowMissingParameterError('segment_id');
  });

  describe('#multipleContactsRunStatus', function() {
    const runId = 'abc-efg-63636';
    testApiMethod(SegmentAPI, 'multipleContactsRunStatus').withArgs({
      run_id: runId
    }).shouldGetResultFromEndpoint(`/filter/runs/${runId}`);

    testApiMethod(SegmentAPI, 'multipleContactsRunStatus').shouldThrowMissingParameterError('run_id');
  });
});
