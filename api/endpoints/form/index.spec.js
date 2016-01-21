'use strict';

var FormApi = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI Form endpoint', function() {

  describe('#list', function() {

    testApiMethod(FormApi, 'list').withArgs({}).shouldGetResultFromEndpoint('/form');

  });

});
