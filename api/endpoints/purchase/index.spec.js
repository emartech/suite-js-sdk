'use strict';

var PurchaseAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI Smart Insight endpoint', function() {


  describe('#list', function() {

    testApiMethod(PurchaseAPI, 'list').withArgs({
      start_date: '2015-02-03',
      end_date: '2015-03-04',
      offset: '0',
      limit: 10
    }).shouldGetResultFromEndpoint('/purchases/?start_date=2015-02-03&end_date=2015-03-04&offset=0&limit=10');

  });


  describe('#stats', function() {

    testApiMethod(PurchaseAPI, 'stats').withArgs({
      start_date: '2015-02-03',
      end_date: '2015-03-04'
    }).shouldGetResultFromEndpoint('/purchases/stats/?start_date=2015-02-03&end_date=2015-03-04');

  });

});
