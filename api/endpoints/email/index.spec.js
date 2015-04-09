'use strict';

var expect = require('chai').expect;
var EmailAPI = require('./');

describe('Suite Email', function() {

  it('copies an existing email', function () {

    var api = EmailAPI.create({
      post: function (customerId, url, payload) {
        expect(url).to.equal('/email/32/copy');
        expect(payload).to.eql({
          name: '3'
        });
      }
    });

    api.copy(0, 32, {
      name: '3'
    });

  });

  it('updates the source of an email', function () {

    var api = EmailAPI.create({
      post: function (customerId, url, payload) {
        expect(url).to.equal('/email/32/updatesource');
        expect(payload).to.eql({
          contactlistId: '3'
        });
      }
    });

    api.updateSource(0, 32, {
      contactlistId: '3'
    });

  });

  it('launches an existing email', function () {

    var time = Date.now();

    var api = EmailAPI.create({
      post: function (customerId, url, payload) {
        expect(url).to.equal('/email/32/launch');
        expect(payload).to.eql({
          schedule: time,
          timezone: 'Pacific/Midway'
        });
      }
    });

    api.launch(0, 32, time, 'Pacific/Midway');
  });

});
