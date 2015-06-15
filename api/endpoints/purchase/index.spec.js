'use strict';

var expect = require('chai').expect;
var PurchaseAPI = require('./');

describe('Suite Smart Insight', function() {

  it('gets purchases', function() {

    var api = PurchaseAPI.create({
      get: function(customerId, url) {
        expect(customerId).to.equal(0);
        expect(url).to.equal('/purchases/?start_date=2015-02-03T09:18:13Z&end_date=2015-03-03T09:18:13Z&offset=0&limit=10');
      }
    });

    api.list(0, '2015-02-03T09:18:13Z', '2015-03-03T09:18:13Z', 0, 10);
  });

});
