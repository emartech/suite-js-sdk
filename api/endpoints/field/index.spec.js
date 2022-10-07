'use strict';

var FieldAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI Field endpoint', function() {

  describe('#create', function() {

    testApiMethod(FieldAPI, 'create').withArgs({
      name: 'The name of the new field',
      application_type: 'shorttext'
    }).shouldPostToEndpoint('/field', {
      name: 'The name of the new field',
      application_type: 'shorttext'
    });

  });

  describe('#get', function() {
    testApiMethod(FieldAPI, 'get').withArgs({ translate_id: 'en' }).shouldGetResultFromEndpoint('/field/translate/en');

    testApiMethod(FieldAPI, 'get').withArgs({}).shouldThrowMissingParameterError('translate_id');
  });


  describe('#getChoices', function() {
    testApiMethod(FieldAPI, 'getChoices').withArgs({}).shouldThrowMissingParameterError('field_id');

    testApiMethod(FieldAPI, 'getChoices').withArgs({ field_id: 123 }).shouldGetResultFromEndpoint('/field/123/choice');

    testApiMethod(FieldAPI, 'getChoices').withArgs({ field_id: 123, translate_id: 'fr' }).shouldGetResultFromEndpoint('/field/123/choice/translate/fr');
  });


  describe('#getMultipleChoices', function() {
    testApiMethod(FieldAPI, 'getMultipleChoices').withArgs({}).shouldThrowMissingParameterError('field_id');

    testApiMethod(FieldAPI, 'getMultipleChoices').withArgs({ field_ids: [123, 456] }).shouldGetResultFromEndpoint('/field/choices?fields=123,456');

    testApiMethod(FieldAPI, 'getMultipleChoices').withArgs({ field_ids: [123, 456], translate_id: 'fr' }).shouldGetResultFromEndpoint('/field/choices?fields=123,456&language=fr');
  });

});
