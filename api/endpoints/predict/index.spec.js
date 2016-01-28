'use strict';

var PredictAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI Predict Endpoint', function() {

  describe('#listWidgets', function() {

    testApiMethod(PredictAPI, 'listWidgets').shouldGetResultFromEndpoint('/predict');

  });

  describe('#getWidget', function() {

    testApiMethod(PredictAPI, 'getWidget').withArgs({ widget_id: 'asd123' }).shouldGetResultFromEndpoint('/predict/asd123');

    testApiMethod(PredictAPI, 'getWidget').withArgs({}).shouldThrowMissingParameterError('widget_id');

  });

  describe('#newWidget', function() {

    testApiMethod(PredictAPI, 'newWidget').shouldGetResultFromEndpoint('/predict/new');

  });

  describe('#cloneWidget', function() {

    testApiMethod(PredictAPI, 'cloneWidget').withArgs({ widget_id: 'asd123' }).shouldGetResultFromEndpoint('/predict/new/from/asd123');

    testApiMethod(PredictAPI, 'cloneWidget').withArgs({}).shouldThrowMissingParameterError('widget_id');

  });

  describe('#hideWidget', function() {

    testApiMethod(PredictAPI, 'hideWidget').withArgs({ widget_id: 'asd123' }).shouldPostToEndpoint('/predict/asd123/hide', {});

    testApiMethod(PredictAPI, 'hideWidget').withArgs({}).shouldThrowMissingParameterError('widget_id');

  });

  describe('#showWidget', function() {

    testApiMethod(PredictAPI, 'showWidget').withArgs({ widget_id: 'asd123' }).shouldPostToEndpoint('/predict/asd123/show', {});

    testApiMethod(PredictAPI, 'showWidget').withArgs({}).shouldThrowMissingParameterError('widget_id');

  });

});
