'use strict';

var Translator = require('./translator');

describe('Translations translator', function() {

  describe('#translate', function() {

    var testCases = [{
      should: 'should gives back the key if the translations do not have the key',
      dictionary: {},
      keyToTranslate: 'doesntExistsInTheDictionary',
      expectedTranslation: 'doesntExistsInTheDictionary'
    }, {
      should: 'should gives back the translation for that key',
      dictionary: { 'translationKey': 'translationValue' },
      keyToTranslate: 'translationKey',
      expectedTranslation: 'translationValue'
    }, {
      should: 'should gives back the translation for the nested keys',
      dictionary: {
        translationKey: 'not a good answer',
        deep: {
          toDeep: {
            translationKey: 'translationValue'
          }
        }
      },
      keyToTranslate: 'deep.toDeep.translationKey',
      expectedTranslation: 'translationValue'
    }, {
      should: 'should gives back key when nested key is not found',
      dictionary: {
        translationKey: 'not a good answer',
        deep: {
          toDeep: {
            translationKey: 'translationValue'
          }
        }
      },
      keyToTranslate: 'deep.deep.doesNotExistKey.value',
      expectedTranslation: 'deep.deep.doesNotExistKey.value'
    }, {
      should: 'should gives back the translation if the key has dot notation',
      dictionary: {
        'translationKey.afterdot': 'good translation'
      },
      keyToTranslate: 'translationKey.afterdot',
      expectedTranslation: 'good translation'
    }, {
      should: 'should gives back the translation if the deep key has dot notation',
      dictionary: {
        validationMessages: {
          'not a valid username. not a valid password': 'NOT A VALID PASSWORD IN SPAIN'
        }
      },
      keyToTranslate: 'validationMessages.not a valid username. not a valid password',
      expectedTranslation: 'NOT A VALID PASSWORD IN SPAIN'
    }, {
      should: 'should gives back the replaced value for the key',
      dictionary: { 'translationKey': 'translationValue %s' },
      keyToTranslate: 'translationKey',
      params: ['param'],
      expectedTranslation: 'translationValue param'
    }];

    testCases.forEach(function(testCase) {

      it(testCase.should, function() {
        var translator = new Translator(testCase.dictionary);
        var translation = translator.translate(testCase.keyToTranslate, testCase.params);

        expect(translation).to.eql(testCase.expectedTranslation);
      });

    });

  });

});
