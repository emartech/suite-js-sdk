'use strict';

var LanguageAPI = require('./');
var apiTest = require('../../../test-helper');

describe('Suite Language', function() {

  apiTest.testSDKMethodResponse(LanguageAPI, {
    translate: [
      {
        method: 'get',
        expectedUrl: '/language/translate'
      },
      {
        method: 'get',
        arguments: ['en'],
        expectedUrl: '/language/translate/en'
      }
    ]
  });

});
