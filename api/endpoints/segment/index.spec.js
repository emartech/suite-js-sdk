'use strict';

var expect = require('chai').expect;
var apiTest = require('../../../test-helper');
var SegmentAPI = require('./');

describe('Suite Segment', function() {

  it('list segments', function() {

    var api = SegmentAPI.create({
      get: function(customerId, url, options) {
        expect(url).to.equal('/filter');
        expect(options.customerId).to.equal(1);
      }
    });

    api.listSegments({

    }, {
      customerId: 1
    });
  });

  it('list contacts in a segment', function() {

    var api = SegmentAPI.create({
      get: function(customerId, url) {
        expect(url).to.equal('/filter/10/contacts/?limit=100&offset=0');
      }
    });

    api.listContacts({
      segmentId: 10,
      limit: 100,
      offset:0
    }, {
      customerId: 1
    });
  });

});
