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


  describe('#get', function() {
    testApiMethod(EmailAPI, 'get').withArgs({ email_id: 12 }).shouldGetResultFromEndpoint('/email/12');

    testApiMethod(EmailAPI, 'get').withArgs({}).shouldThrowMissingParameterError('email_id');
  });


  describe('#patch', function() {
    testApiMethod(EmailAPI, 'patch').withArgs({
      email_id: 12,
      additional_data: 'someData'
    }).shouldPostToEndpoint('/email/12/patch', {
      additional_data: 'someData'
    });

    testApiMethod(EmailAPI, 'patch').withArgs({}).shouldThrowMissingParameterError('email_id');
  });

  
});
