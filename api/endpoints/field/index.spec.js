'use strict';

var expect = require('chai').expect;
var FieldAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI Field endpoint', function() {

  describe('#get', function() {
    testApiMethod(FieldAPI, 'get').withArgs({ translate_id: 'en' }).shouldGetResultFromEndpoint('/field/translate/en');

    testApiMethod(FieldAPI, 'get').withArgs({}).shouldThrowMissingParameterError('translate_id');
  });

});
