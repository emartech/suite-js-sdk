'use strict';

var SourceAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI Source endpoint', function() {

  describe('#listSources', function() {
    testApiMethod(SourceAPI, 'listSources').withArgs({}).shouldGetResultFromEndpoint('/source');
  });

  describe('#create', function() {

    testApiMethod(SourceAPI, 'create').withArgs({
      name: 'new source'
    }).shouldPostToEndpoint('/source/create', {
      name: 'new source'
    });
  });

});
