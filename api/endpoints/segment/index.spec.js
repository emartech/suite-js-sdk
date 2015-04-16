'use strict';

var expect = require('chai').expect;
var apiTest = require('../../../test-helper');
var SegmentAPI = require('./');

describe.only('Suite Segment', function() {

  var sdkMethods = {
    listSegments: {
      method: 'get',
      expectedUrl: '/filter'
    }
  };

  apiTest.testSDKMethodResponse(SegmentAPI, sdkMethods);

  it('list contacts in a segment', function () {

    var api = SegmentAPI.create({
      get: function (customerId, url) {
        expect(url).to.equal('/filter/10/contacts/limit=100&offset=0');
      }
    });

    api.listContacts(0, 10, 0, 100);
  });

});
