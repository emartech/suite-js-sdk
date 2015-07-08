'use strict';

var ContactAPI = require('./');
var testApiMethod = require('../../../test-api-method');

describe('SuiteAPI Contact endpoint', function() {

  describe('#create', function() {

    testApiMethod(ContactAPI, 'create').withArgs({
      name: 'contactName'
    }).shouldPostToEndpoint('/contact', {
      name: 'contactName'
    });

  });

});
