'use strict';

var ExportAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI Export endpoint', function() {

  describe('getData', function() {
    testApiMethod(ExportAPI, 'getData').withArgs({ export_id: 1 }).shouldGetResultFromEndpoint('/export/1/data/offset=&limit=');
    testApiMethod(ExportAPI, 'getData').withArgs({ export_id: 1, offset: 2 }).shouldGetResultFromEndpoint('/export/1/data/offset=2&limit=');
    testApiMethod(ExportAPI, 'getData').withArgs({ export_id: 1, limit: 3 }).shouldGetResultFromEndpoint('/export/1/data/offset=&limit=3');
    testApiMethod(ExportAPI, 'getData').withArgs({ export_id: 1, offset: 2, limit: 3 }).shouldGetResultFromEndpoint('/export/1/data/offset=2&limit=3');
    testApiMethod(ExportAPI, 'getData').withArgs().shouldThrowMissingParameterError('export_id');
    testApiMethod(ExportAPI, 'getData').withArgs({ limit: 3 }).shouldThrowMissingParameterError('export_id');
    testApiMethod(ExportAPI, 'getData').withArgs({ offset: 2 }).shouldThrowMissingParameterError('export_id');
    testApiMethod(ExportAPI, 'getData').withArgs({ offset: 2, limit: 3 }).shouldThrowMissingParameterError('export_id');
  });

});
