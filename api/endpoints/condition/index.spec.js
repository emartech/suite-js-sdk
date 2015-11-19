'use strict';

var expect = require('chai').expect;
var ConditionAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI Condition endpoint', function() {

  describe('#list', function() {
    testApiMethod(ConditionAPI, 'list').shouldGetResultFromEndpoint('/condition');
  });

  describe('#listWithContactFields', function() {
    testApiMethod(ConditionAPI, 'listWithContactFields').shouldGetResultFromEndpoint('/condition/contact_fields');
  });

});
