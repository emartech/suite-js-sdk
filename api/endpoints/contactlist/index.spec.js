'use strict';

var ContactListApi = require('./');
var testApiMethod = require('../../../test-api-method');

describe('SuiteAPI Contact List', function() {

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
      contactListId: 2
    }).shouldGetResultFromEndpoint('/contactlist/2/contacts');

  });

});
