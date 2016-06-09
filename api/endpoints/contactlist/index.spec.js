'use strict';

var ContactListApi = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI Contact List endpoint', function() {

  describe('#create', function() {

    testApiMethod(ContactListApi, 'create').withArgs({
      key_id: 'id',
      name: 'new fancy list',
      external_ids: [1, 2]
    }).shouldPostToEndpoint('/contactlist', {
      key_id: 'id',
      name: 'new fancy list',
      external_ids: [1, 2]
    });

  });


  describe('#list', function() {

    testApiMethod(ContactListApi, 'list').withArgs({
      contact_list_id: 2
    }).shouldGetResultFromEndpoint('/contactlist/2/contacts');

  });


  describe('#add', function() {

    testApiMethod(ContactListApi, 'add').withArgs({
      contact_list_id: 1,
      key_id: 'id',
      name: 'new fancy list',
      external_ids: [1, 2]
    }).shouldPostToEndpoint('/contactlist/1/add', {
      key_id: 'id',
      name: 'new fancy list',
      external_ids: [1, 2]
    });

  });


  describe('#listContactLists', function() {
    testApiMethod(ContactListApi, 'listContactLists').withArgs({}).shouldGetResultFromEndpoint('/contactlist');
  });


  describe('#count', function() {

    testApiMethod(ContactListApi, 'count').withArgs({
      contact_list_id: 2
    }).shouldGetResultFromEndpoint('/contactlist/2/count');

  });


  describe('#getContactsData', function() {

    testApiMethod(ContactListApi, 'getContactsData').withArgs({
      contact_list_id: 2,
      fields: "email,first_name",
      limit: 10,
      offset: 1,
      stringids: 1
    }).shouldGetResultFromEndpoint('/contactlist/2/contacts/data?fields=email,first_name&limit=10&offset=1&stringids=1');

  });

});
