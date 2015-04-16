'use strict';

var expect = require('chai').expect;
var SegmentAPI = require('./');

describe('Suite Segment', function() {

  it('list contacts in a segment', function () {

    var api = SegmentAPI.create({
      get: function (customerId, url) {
        expect(url).to.equal('/filter/10/contacts/limit=100&offset=0');
      }
    });

    api.listContacts(0, 10, 0, 100);
  });

  it('list segments', function () {

    var api = SegmentAPI.create({
      get: function (customerId, url) {
        expect(url).to.equal('/filter');
      }
    });

    api.listSegments(1);
  });

});
