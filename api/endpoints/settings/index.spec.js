'use strict';

var SettingsAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI Settings endpoint', function() {

  describe('#getSettings', function() {
    testApiMethod(SettingsAPI, 'getSettings').shouldGetResultFromEndpoint('/settings');
  });


  describe('#getCorporateDomains', function() {
    testApiMethod(SettingsAPI, 'getCorporateDomains').shouldGetResultFromEndpoint('/settings/corporatedomain');
  });


  describe('#setCorporateDomains', function() {
    testApiMethod(SettingsAPI, 'setCorporateDomains').withArgs({
      domains: ['domain1.com', 'domain2.com']
    }).shouldPutToEndpoint('/settings/corporatedomain', {
      domains: ['domain1.com', 'domain2.com']
    });
  });


  describe('#getDeliverability', function() {
    testApiMethod(SettingsAPI, 'getDeliverability').shouldGetResultFromEndpoint('/settings/deliverability');
  });


  describe('#getLinkCategories', function() {
    testApiMethod(SettingsAPI, 'getLinkCategories').shouldGetResultFromEndpoint('/settings/linkcategories');
  });

});
