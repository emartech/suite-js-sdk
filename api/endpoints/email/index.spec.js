'use strict';

var expect = require('chai').expect;
var EmailAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI Email endpoint', function() {

  describe('#list', function() {
    testApiMethod(EmailAPI, 'list').shouldGetResultFromEndpoint('/email');
  });


  describe('#copy', function() {
    testApiMethod(EmailAPI, 'copy').withArgs({
      email_id: 32,
      name: '3'
    }).shouldPostToEndpoint('/email/32/copy', {
      name: '3'
    });

    testApiMethod(EmailAPI, 'copy').withArgs({}).shouldThrowMissingParameterError('email_id');
  });


  describe('#updateSource', function() {
    testApiMethod(EmailAPI, 'updateSource').withArgs({
      contactlistId: '3',
      email_id: 32
    }).shouldPostToEndpoint('/email/32/updatesource', {
      contactlistId: '3'
    });

    testApiMethod(EmailAPI, 'updateSource').withArgs({}).shouldThrowMissingParameterError('email_id');
  });


  describe('#launch', function() {
    var time = Date.now();

    testApiMethod(EmailAPI, 'launch').withArgs({
      email_id: 32,
      schedule: time,
      timezone: 'Pacific/Midway'
    }).shouldPostToEndpoint('/email/32/launch', {
      schedule: time,
      timezone: 'Pacific/Midway'
    });

    testApiMethod(EmailAPI, 'launch').withArgs({}).shouldThrowMissingParameterError('email_id');
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
  
});
