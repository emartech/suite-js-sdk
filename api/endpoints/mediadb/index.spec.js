'use strict';

var MediaDBAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI folder endpoint', function() {

  describe('#createFolder', function() {

    testApiMethod(MediaDBAPI, 'createFolder')
      .withArgs({})
      .shouldThrowMissingParameterError(['name', 'parent']);

    testApiMethod(MediaDBAPI, 'createFolder').withArgs({
      name: 'folder name',
      parent: '1'
    }).shouldPostToEndpoint('/folder', {
      name: 'folder name',
      parent: '1'
    });

  });

});
