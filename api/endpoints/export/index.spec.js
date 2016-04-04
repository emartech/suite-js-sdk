'use strict';

var ExportAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI Export endpoint', function() {

  describe('getData', function() {
    testApiMethod(ExportAPI, 'getData').withArgs({ export_id: 1 }).shouldGetResultFromEndpoint('/export/1/data');
    testApiMethod(ExportAPI, 'getData').withArgs().shouldThrowMissingParameterError('export_id');
  });

});
