'use strict';

var ContactAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI Contact endpoint', function() {

  describe('#create', function() {

    testApiMethod(ContactAPI, 'create').withArgs({
      name: 'contactName'
    }).shouldPostToEndpoint('/contact', {
      name: 'contactName'
    });

  });

  describe('#getData', function() {

    testApiMethod(ContactAPI, 'getData').withArgs({}).shouldThrowMissingParameterError('keyValues');

    testApiMethod(ContactAPI, 'getData').withArgs({
      keyValues: [123,456,789]
    }).shouldPostToEndpoint('/contact/getdata', {
      keyValues: [123,456,789]
    });

    testApiMethod(ContactAPI, 'getData').withArgs({
      keyId: '3',
      keyValues: ['john@example.com', 'jane@example.com']
    }).shouldPostToEndpoint('/contact/getdata', {
      keyId: '3',
      keyValues: ['john@example.com', 'jane@example.com']
    });

    testApiMethod(ContactAPI, 'getData').withArgs({
      keyValues: [123,456,789],
      fields: [3]
    }).shouldPostToEndpoint('/contact/getdata', {
      keyValues: [123,456,789],
      fields: [3]
    });
  });

});
