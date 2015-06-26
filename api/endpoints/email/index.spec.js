'use strict';

var expect = require('chai').expect;
var EmailAPI = require('./');

describe('Suite Email', function() {

  it('lists emails', function() {

    var api = EmailAPI.create({
      get: function(customerId, url) {
        expect(url).to.equal('/email');
      }
    });

    api.list();
  });

  it('copies an existing email', function() {

    var api = EmailAPI.create({
      post: function(customerId, url, payload) {
        expect(url).to.equal('/email/32/copy');
        expect(payload).to.eql({
          name: '3'
        });
      }
    });

    api.copy({
      emailId: 32,
      name: '3'
    });

  });

  it('updates the source of an email', function() {

    var api = EmailAPI.create({
      post: function(customerId, url, payload) {
        expect(url).to.equal('/email/32/updatesource');
        expect(payload).to.eql({
          contactlistId: '3'
        });
      }
    });

    api.updateSource({
      contactlistId: '3',
      emailId: 32
    });

  });

  it('launches an existing email', function() {

    var time = Date.now();

    var api = EmailAPI.create({
      post: function(customerId, url, payload) {
        expect(url).to.equal('/email/32/launch');
        expect(payload).to.eql({
          schedule: time,
          timezone: 'Pacific/Midway'
        });
      }
    });

    api.launch({
      emailId: 32,
      schedule: time,
      timezone: 'Pacific/Midway'
    });
  });

});
