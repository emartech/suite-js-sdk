'use strict';

var PredictAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI Predict Endpoint', function() {

  describe('#listWidgets', function() {

    testApiMethod(PredictAPI, 'listWidgets').shouldGetResultFromEndpoint('/predict');

  });

});
