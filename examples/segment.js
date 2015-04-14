var SuiteAPI = require('../').api;
var suiteAPI = SuiteAPI.create();

var CUSTOMER_ID = 0;
var SEGMENT_ID = 0;
var OFFSET = 0;
var LIMIT = 10000;

suiteAPI.segment.listContacts(CUSTOMER_ID, SEGMENT_ID, OFFSET, LIMIT)
  .then(function (contacts) {
    console.log('contacts', contacts);
  })
  .catch(function (err) {
    console.log('err', err);
  });
