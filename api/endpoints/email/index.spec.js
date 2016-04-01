'use strict';

var EmailAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI Email endpoint', function() {

  describe('#list', function() {
    testApiMethod(EmailAPI, 'list').shouldGetResultFromEndpoint('/email');
  });

  describe('#create', function() {

    testApiMethod(EmailAPI, 'create').withArgs({
      name: 'emailCampaign01',
      language: 'en'
    }).shouldPostToEndpoint('/email', {
      name: 'emailCampaign01',
      language: 'en'
    });

    testApiMethod(EmailAPI, 'create').withArgs({
      language: 'en'
    }).shouldThrowMissingParameterError('name');

    testApiMethod(EmailAPI, 'create').withArgs({
      name: 'emailCampaign01'
    }).shouldThrowMissingParameterError('language');

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

  describe('#delete', function() {
    testApiMethod(EmailAPI, 'delete').withArgs({
      emailId: 32
    }).shouldPostToEndpoint('/email/delete', {
      emailId: 32
    });

    testApiMethod(EmailAPI, 'delete').withArgs({}).shouldThrowMissingParameterError('emailId');
  });

  describe('#createVersion', function() {
    testApiMethod(EmailAPI, 'createVersion').withArgs({
      email_id: 32,
      version_name: 'testversion',
      copy_parameters: true
    }).shouldPostToEndpoint('/email/32/versions', {
      version_name: 'testversion',
      copy_parameters: true
    });

    testApiMethod(EmailAPI, 'createVersion').withArgs({}).shouldThrowMissingParameterError('email_id');
  });

  describe('#renameVersion', function() {
    testApiMethod(EmailAPI, 'renameVersion').withArgs({
      email_id: 32,
      version_id: 5,
      version_name: 'testversion'
    }).shouldPostToEndpoint('/email/32/versions/5', {
      version_name: 'testversion'
    });

    testApiMethod(EmailAPI, 'renameVersion').withArgs({}).shouldThrowMissingParameterError(
      ['email_id', 'version_id']
    );
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

  describe('#listVersions', function() {
    testApiMethod(EmailAPI, 'listVersions').withArgs({ email_id: 12 }).shouldGetResultFromEndpoint('/email/12/versions');
    testApiMethod(EmailAPI, 'listVersions').withArgs({}).shouldThrowMissingParameterError('email_id');
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

  describe('#createTrackedLink', function() {
    testApiMethod(EmailAPI, 'createTrackedLink').withArgs({})
      .shouldThrowMissingParameterError('email_id');

    testApiMethod(EmailAPI, 'createTrackedLink').withArgs({
      email_id: 12
    }).shouldThrowMissingParameterError('section_id');

    testApiMethod(EmailAPI, 'createTrackedLink').withArgs({
      email_id: 12,
      section_id: 1
    }).shouldThrowMissingParameterError('url');

    testApiMethod(EmailAPI, 'createTrackedLink').withArgs({
      email_id: 12,
      section_id: 1,
      url: 'http://example.com'
    }).shouldPostToEndpoint('/email/12/trackedlinks', {
      section_id: 1,
      url: 'http://example.com'
    });

    testApiMethod(EmailAPI, 'createTrackedLink').withArgs({
      email_id: 12,
      section_id: 1,
      url: 'http://example.com',
      title: 'title #1',
      cat_id: 1
    }).shouldPostToEndpoint('/email/12/trackedlinks', {
      section_id: 1,
      url: 'http://example.com',
      title: 'title #1',
      cat_id: 1
    });
  });

  describe('#getTrackedLinks', function() {
    testApiMethod(EmailAPI, 'getTrackedLinks').withArgs({})
      .shouldThrowMissingParameterError('email_id');

    testApiMethod(EmailAPI, 'getTrackedLinks').withArgs({
      email_id: 12
    }).shouldGetResultFromEndpoint('/email/12/trackedlinks');

    testApiMethod(EmailAPI, 'getTrackedLinks').withArgs({
      email_id: 12,
      with_meta: 1
    }).shouldGetResultFromEndpoint('/email/12/trackedlinks/?with_meta=1');

    testApiMethod(EmailAPI, 'getTrackedLinks').withArgs({
      email_id: 12,
      link_id: 13
    }).shouldGetResultFromEndpoint('/email/12/trackedlinks/13');

    testApiMethod(EmailAPI, 'getTrackedLinks').withArgs({
      email_id: 12,
      link_id: 13,
      with_meta: 1
    }).shouldGetResultFromEndpoint('/email/12/trackedlinks/13/?with_meta=1');
  });

  describe('#updateTrackedLink', function() {
    testApiMethod(EmailAPI, 'updateTrackedLink').withArgs({}).shouldThrowMissingParameterError('email_id');

    testApiMethod(EmailAPI, 'updateTrackedLink').withArgs({
      email_id: 12
    }).shouldThrowMissingParameterError('link_id');

    testApiMethod(EmailAPI, 'updateTrackedLink').withArgs({
      email_id: 12,
      link_id: 13
    }).shouldThrowMissingParameterError('url');

    testApiMethod(EmailAPI, 'updateTrackedLink').withArgs({
      email_id: 12,
      link_id: 13,
      url: 'http://example.com'
    }).shouldPostToEndpoint('/email/12/trackedlinks/13', {
      url: 'http://example.com'
    });

    testApiMethod(EmailAPI, 'updateTrackedLink').withArgs({
      email_id: 12,
      link_id: 13,
      url: 'http://example.com',
      title: 'title #1',
      cat_id: 1
    }).shouldPostToEndpoint('/email/12/trackedlinks/13', {
      url: 'http://example.com',
      title: 'title #1',
      cat_id: 1
    });
  });

  describe('#deleteTrackedLinks', function() {
    testApiMethod(EmailAPI, 'deleteTrackedLinks').withArgs({ email_id: 12, link_id: 14 })
      .shouldPostToEndpoint('/email/12/deletetrackedlinks/14', {});

    testApiMethod(EmailAPI, 'deleteTrackedLinks').withArgs({ email_id: 12 })
      .shouldPostToEndpoint('/email/12/deletetrackedlinks', {});

    testApiMethod(EmailAPI, 'deleteTrackedLinks').withArgs({}).shouldThrowMissingParameterError('email_id');
  });

  describe('#deleteTrackedLinksBySource', function() {
    testApiMethod(EmailAPI, 'deleteTrackedLinksBySource').withArgs({ email_id: 12, source: 'text' })
      .shouldPostToEndpoint('/email/12/deletetrackedlinks/text', {});

    testApiMethod(EmailAPI, 'deleteTrackedLinksBySource').withArgs({ email_id: 12 }).shouldThrowMissingParameterError('source');
  });

  describe('#launchList', function() {
    testApiMethod(EmailAPI, 'launchList').withArgs({
      emailId: 32
    }).shouldPostToEndpoint('/email/getlaunchesofemail', {
      emailId: 32
    });

    testApiMethod(EmailAPI, 'launchList').withArgs({}).shouldThrowMissingParameterError('emailId');
  });

  describe('#getDeliveryStatus', function() {
    testApiMethod(EmailAPI, 'getDeliveryStatus').withArgs({
      emailId: 32
    }).shouldPostToEndpoint('/email/getdeliverystatus', {
      emailId: 32
    });

    testApiMethod(EmailAPI, 'getDeliveryStatus').withArgs({}).shouldThrowMissingParameterError('emailId');
  });

  describe('#responses', function() {
    testApiMethod(EmailAPI, 'responses').withArgs({
      type: 'opened'
    }).shouldPostToEndpoint('/email/responses', {
      type: 'opened'
    });

    testApiMethod(EmailAPI, 'responses').withArgs({}).shouldThrowMissingParameterError('emailId');
  });

  describe('#getContacts', function() {
    testApiMethod(EmailAPI, 'getContacts').withArgs({
      distribution_method: 'local',
      contactlist: 1,
      contact_fields: ['3'],
      add_field_names_header: 0,
      notification_url: 'localhost:1111/api/test'
    }).shouldPostToEndpoint('/email/getcontacts', {
      distribution_method: 'local',
      contactlist: 1,
      contact_fields: ['3'],
      add_field_names_header: 0,
      notification_url: 'localhost:1111/api/test'
    });
  });

});
