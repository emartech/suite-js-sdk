'use strict';

var FieldAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI Field endpoint', function() {

  describe('#get', function() {
    testApiMethod(FieldAPI, 'get').withArgs({ translate_id: 'en' }).shouldGetResultFromEndpoint('/field/translate/en');

    testApiMethod(FieldAPI, 'get').withArgs({}).shouldThrowMissingParameterError('translate_id');
  });


  describe('#getChoices', function() {
    testApiMethod(FieldAPI, 'getChoices').withArgs({}).shouldThrowMissingParameterError('field_id');

    testApiMethod(FieldAPI, 'getChoices').withArgs({ field_id: 123 }).shouldGetResultFromEndpoint('/field/123/choice');

    testApiMethod(FieldAPI, 'getChoices').withArgs({ field_id: 123, translate_id: 'fr' }).shouldGetResultFromEndpoint('/field/123/choice/translate/fr');
  });

});
