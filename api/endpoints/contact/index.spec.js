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

  describe('#update', function() {

    testApiMethod(ContactAPI, 'update').withArgs({
      name: 'contactName'
    }).shouldPutToEndpoint('/contact', {
      name: 'contactName'
    });

  });

  describe('#createOrUpdate', function() {

    testApiMethod(ContactAPI, 'createOrUpdate').withArgs({
      name: 'contactName'
    }).shouldPutToEndpoint('/contact/create_if_not_exists=1', {
      name: 'contactName'
    });

  });

  describe('#getData', function() {

    testApiMethod(ContactAPI, 'getData').withArgs({}).shouldThrowMissingParameterError('keyValues');

    testApiMethod(ContactAPI, 'getData').withArgs({
      keyValues: [123, 456, 789]
    }).shouldPostToEndpoint('/contact/getdata', {
      keyValues: [123, 456, 789]
    });

    testApiMethod(ContactAPI, 'getData').withArgs({
      keyId: '3',
      keyValues: ['john@example.com', 'jane@example.com']
    }).shouldPostToEndpoint('/contact/getdata', {
      keyId: '3',
      keyValues: ['john@example.com', 'jane@example.com']
    });

    testApiMethod(ContactAPI, 'getData').withArgs({
      keyValues: [123, 456, 789],
      fields: [3]
    }).shouldPostToEndpoint('/contact/getdata', {
      keyValues: [123, 456, 789],
      fields: [3]
    });
  });

  describe('#merge', function() {

    testApiMethod(ContactAPI, 'merge').withArgs({
      key_id: 3,
      target_key_value: 'test@example.com',
      source_key_value: 'new@example.com',
      delete_source: true,
      merge_rules: { push_open_clicks: 'overwrite' }
    }).shouldPostToEndpoint('/contact/merge', {
      key_id: 3,
      target_key_value: 'test@example.com',
      source_key_value: 'new@example.com',
      delete_source: true,
      merge_rules: { push_open_clicks: 'overwrite' }
    });

  });

});
