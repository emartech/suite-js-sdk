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

  describe('#getChanges', function() {
    testApiMethod(ExportAPI, 'getChanges').withArgs({
      distribution_method: 'ftp',
      origin: 'form',
      origin_id: '123',
      time_range: ['2012-02-09', '2012-04-02'],
      contact_fields: ['1', '3', '106533'],
      delimiter: ';',
      add_field_names_header: 1,
      language: 'en',
      ftp_settings:
      {
        host: 'www.example.com',
        port: '1234',
        username: 'user',
        password: 'pass',
        folder: 'path/of/a/folder'
      }
    }).shouldPostToEndpoint('/contact/getchanges', {
      distribution_method: 'ftp',
      origin: 'form',
      origin_id: '123',
      time_range: ['2012-02-09', '2012-04-02'],
      contact_fields: ['1', '3', '106533'],
      delimiter: ';',
      add_field_names_header: 1,
      language: 'en',
      ftp_settings:
      {
        host: 'www.example.com',
        port: '1234',
        username: 'user',
        password: 'pass',
        folder: 'path/of/a/folder'
      }
    });
  });

});
