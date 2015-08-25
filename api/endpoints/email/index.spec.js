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


  describe('#getRaw', function() {
    testApiMethod(EmailAPI, 'getRaw').withArgs({ email_id: 12 }).shouldGetResultFromEndpoint('/email/12/raw');
    testApiMethod(EmailAPI, 'getRaw').withArgs({}).shouldThrowMissingParameterError('email_id');
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


  describe('#sendTestMail', function() {
    testApiMethod(EmailAPI, 'sendTestMail').withArgs({
      email_id: 12,
      recipientlist: 'foo@bar.com'
    }).shouldPostToEndpoint('/email/12/sendtestmail', {
      recipientlist: 'foo@bar.com'
    });

    testApiMethod(EmailAPI, 'sendTestMail').withArgs({}).shouldThrowMissingParameterError('email_id');
  });

  describe('#getPersonalizations', function() {
    testApiMethod(EmailAPI, 'getPersonalizations').withArgs({
      email_id: 12
    }).shouldGetResultFromEndpoint('/email/12/personalization');

    testApiMethod(EmailAPI, 'getPersonalizations').withArgs({}).shouldThrowMissingParameterError('email_id');
  });

  describe('#setPersonalizations', function() {
    testApiMethod(EmailAPI, 'setPersonalizations').withArgs({
      email_id: 12,
      data: [
        {
          element: 0,
          defaultValue: 'foo'
        },
        {
          element: 1,
          defaultValue: 'bar'
        }
      ]
    }).shouldPostToEndpoint('/email/12/personalization', [
        {
          element: 0,
          defaultValue: 'foo'
        },
        {
          element: 1,
          defaultValue: 'bar'
        }
      ]);

    testApiMethod(EmailAPI, 'setPersonalizations').withArgs({}).shouldThrowMissingParameterError('email_id');
  });

  describe('#deleteTrackedLinks', function() {
    testApiMethod(EmailAPI, 'deleteTrackedLinks').withArgs({ email_id: 12, link_id: 14 })
      .shouldPostToEndpoint('/email/12/deletetrackedlinks/14', {});

    testApiMethod(EmailAPI, 'deleteTrackedLinks').withArgs({ email_id: 12 })
      .shouldPostToEndpoint('/email/12/deletetrackedlinks', {});

    testApiMethod(EmailAPI, 'deleteTrackedLinks').withArgs({}).shouldThrowMissingParameterError('email_id');
  });

});
