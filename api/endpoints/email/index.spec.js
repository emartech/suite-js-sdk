'use strict';

var expect = require('chai').expect;
var EmailAPI = require('./');
var apiTest = require('../../../test-helper');

describe('Suite Email', function() {

  var sdkMethods = {
    list: {
      method: 'get',
      expectedUrl: '/email'
    },
    get: {
      method: 'get',
      expectedUrl: '/email/32',
      arguments: [
        32
      ]
    }
  };

  apiTest.testSDKMethodResponse(EmailAPI, sdkMethods);

  it('copies an existing email', function() {

    var api = EmailAPI.create({
      post: function(customerId, url, payload) {
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

  it('updates the source of an email', function() {

    var api = EmailAPI.create({
      post: function(customerId, url, payload) {
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

  it('loads an existing email', function() {

    var api = EmailAPI.create({
      get: function(customerId, url, options) {
        expect(url).to.equal('/email/32');
      }
    });

    api.get(0, 32);

  });

  it('updates data of an existing email', function() {

    var api = EmailAPI.create({
      post: function(customerId, url, payload) {
        expect(url).to.equal('/email/32/patch');
        expect(payload).to.eql({
          subject: 'lorem ipsum'
        });
      }
    });

    api.patch(0, 32, {
      subject: 'lorem ipsum'
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

    api.launch(0, 32, time, 'Pacific/Midway');
  });

});
