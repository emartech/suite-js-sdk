'use strict';

var ExternalEventAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI External Event endpoint', function() {

  describe('#create', function() {
    testApiMethod(ExternalEventAPI, 'create').withArgs({
      name: 'someName'
    }).shouldPostToEndpoint('/event', {
      name: 'someName'
    });
  });

  describe('#list', function() {
    testApiMethod(ExternalEventAPI, 'list')
        .withArgs({})
        .shouldGetResultFromEndpoint('/event');
  });


  describe('#trigger', function() {
    testApiMethod(ExternalEventAPI, 'trigger').withArgs({
      event_id: 543,
      name: 'someName'
    }).shouldPostToEndpoint('/event/543/trigger', {
      name: 'someName'
    });
  });

  describe('#update', function() {
    testApiMethod(ExternalEventAPI, 'update').withArgs({
      event_id: 234,
      name: 'someName'
    }).shouldPostToEndpoint('/event/234', {
      name: 'someName'
    });
  });



});
