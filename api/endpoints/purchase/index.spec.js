'use strict';

var expect = require('chai').expect;
var PurchaseAPI = require('./');

describe('SuiteAPI Smart Insight endpoint', function() {

  it('gets purchases', function() {

    var api = PurchaseAPI.create({
      get: function(customerId, url) {
        expect(customerId).to.equal(1);
        expect(url).to.equal('/purchases/?start_date=2015-02-03&end_date=2015-03-04&offset=0&limit=10');
      }
    });

    api.list({
      start_date: '2015-02-03',
      end_date: '2015-03-04',
      offset: '0',
      limit: 10
    }, {
      customerId: 1
    });

  });

});
