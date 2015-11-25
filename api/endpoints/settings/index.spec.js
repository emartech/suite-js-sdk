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


  describe('#getIpRestrictions', function() {
    testApiMethod(SettingsAPI, 'getIpRestrictions').shouldGetResultFromEndpoint('/settings/iprestrictions');
  });

  describe('#setIpRestrictions', function() {
    testApiMethod(SettingsAPI, 'setIpRestrictions').withArgs([
      { range_start: '10.0.0.1', range_end: '10.0.0.255' },
      { range_start: '192.168.0.1', range_end: '192.168.0.10' }
    ]).shouldPutToEndpoint('/settings/iprestrictions', [
      { range_start: '10.0.0.1', range_end: '10.0.0.255' },
      { range_start: '192.168.0.1', range_end: '192.168.0.10' }
    ]);
  });

  describe('#getSecuritySettings', function() {
    testApiMethod(SettingsAPI, 'getSecuritySettings').shouldGetResultFromEndpoint('/settings/security');
  });

  describe('#setSecuritySettings', function() {
    testApiMethod(SettingsAPI, 'setSecuritySettings').withArgs({
      ip_whitelist_enabled: 1
    }).shouldPutToEndpoint('/settings/security', {
      ip_whitelist_enabled: 1
    });
  });
});
