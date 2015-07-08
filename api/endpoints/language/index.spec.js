'use strict';

var LanguageAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI Language endpoint', function() {

  describe('#translate', function() {

    testApiMethod(LanguageAPI, 'translate').shouldGetResultFromEndpoint('/language/translate');

    testApiMethod(LanguageAPI, 'translate').withArgs({
      language: 'en'
    }).shouldGetResultFromEndpoint('/language/translate/en');

  });

});
