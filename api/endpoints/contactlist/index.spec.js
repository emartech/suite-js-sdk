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

  describe('#fetch', function() {

    testApiMethod(ContactListApi, 'fetch').withArgs({
      contact_list_id: 2
    }).shouldGetResultFromEndpoint('/contactlist/2/contactIds');

    testApiMethod(ContactListApi, 'fetch').withArgs({
      contact_list_id: 2,
      next: '/contactlist/2/contactIds?$skiptoken=750&$top=1000'
    }).shouldGetResultFromEndpoint('/contactlist/2/contactIds?$skiptoken=750&$top=1000');

    testApiMethod(ContactListApi, 'fetch').withArgs({
      contact_list_id: 2
    }).shouldGetResultFromEndpoint('/contactlist/2/contactIds');

    testApiMethod(ContactListApi, 'fetch').withArgs({
      contact_list_id: 2,
      $skiptoken: 4
    }).shouldGetResultFromEndpoint('/contactlist/2/contactIds?$skiptoken=4');

    testApiMethod(ContactListApi, 'fetch').withArgs({
      contact_list_id: 2,
      $skiptoken: 4,
      $top: 10000
    }).shouldGetResultFromEndpoint('/contactlist/2/contactIds?$skiptoken=4&$top=10000');
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

    testApiMethod(ContactListApi, 'count').withArgs({}).shouldThrowMissingParameterError('contact_list_id');

  });


  describe('#getContactsData', function() {

    testApiMethod(ContactListApi, 'getContactsData').withArgs({
      contact_list_id: 2,
      fields: 'email,first_name',
      limit: 10,
      offset: 1,
      stringids: 1
    }).shouldGetResultFromEndpoint('/contactlist/2/contacts/data/?fields=email%2Cfirst_name&limit=10&offset=1&stringids=1');

    testApiMethod(ContactListApi, 'getContactsData').withArgs({}).shouldThrowMissingParameterError('contact_list_id');

  });


  describe('#deleteList', function() {

    testApiMethod(ContactListApi, 'deleteList').withArgs({
      contact_list_id: 4
    }).shouldPostToEndpoint('/contactlist/4/deletelist', {});

    testApiMethod(ContactListApi, 'deleteList').withArgs({}).shouldThrowMissingParameterError('contact_list_id');

  });

});
