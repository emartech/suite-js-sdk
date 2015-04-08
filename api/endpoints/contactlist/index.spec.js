'use strict';

var expect = require('chai').expect;
var ContactListApi = require('./');

describe('Suite Contact List', function() {

  it('creates a contact list', function () {

    var api = ContactListApi.create({
      post: function (customerId, url, payload) {
        expect(url).to.equal('/contactlist');
        expect(payload).to.eql({
          name: 'new fancy list',
          external_ids: [1, 2]
        })
      }
    });

    api.create(0, 'new fancy list', [1, 2]);
  });

});
