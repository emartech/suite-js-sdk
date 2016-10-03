'use strict';

var CombinedSegmentAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI Combined Segment endpoint', function() {

  describe('#list', function() {
    testApiMethod(CombinedSegmentAPI, 'list')
        .withArgs({})
        .shouldGetResultFromEndpoint('/combinedsegments');
  });


  describe('#create', function() {

    testApiMethod(CombinedSegmentAPI, 'create').withArgs({
      name: 'new combined segment'
    }).shouldPostToEndpoint('/combinedsegments', {
      name: 'new combined segment'
    });

    testApiMethod(CombinedSegmentAPI, 'create').withArgs({
      name: 'new combined segment with definition',
      definition: {
        include: {
          relation: 'OR',
          segment_ids: ['123', '456']
        },
        exclude: {
          relation: 'AND',
          segment_ids: ['321', '654']
        }
      }
    }).shouldPostToEndpoint('/combinedsegments', {
      name: 'new combined segment with definition',
      definition: {
        include: {
          relation: 'OR',
          segment_ids: ['123', '456']
        },
        exclude: {
          relation: 'AND',
          segment_ids: ['321', '654']
        }
      }
    });

  });

  describe('#get', function() {
    testApiMethod(CombinedSegmentAPI, 'get').withArgs({
      segment_id: 10
    }).shouldGetResultFromEndpoint('/combinedsegments/10');

    testApiMethod(CombinedSegmentAPI, 'get').shouldThrowMissingParameterError('segment_id');
  });

  describe('#update', function() {
    testApiMethod(CombinedSegmentAPI, 'update').withArgs({
      segment_id: 10,
      segment_data: {
        name: 'new combined segment with definition',
        definition: {
          include: {
            relation: 'OR',
            segment_ids: ['123', '456']
          },
          exclude: {
            relation: 'AND',
            segment_ids: ['321', '654']
          }
        }
      }
    }).shouldPostToEndpoint('/combinedsegments/10', {
      name: 'new combined segment with definition',
      definition: {
        include: {
          relation: 'OR',
          segment_ids: ['123', '456']
        },
        exclude: {
          relation: 'AND',
          segment_ids: ['321', '654']
        }
      }
    });

    testApiMethod(CombinedSegmentAPI, 'update').shouldThrowMissingParameterError('segment_id');
  });

});
