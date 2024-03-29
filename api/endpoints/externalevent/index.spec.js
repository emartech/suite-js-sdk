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

  describe('#get', function() {
    testApiMethod(ExternalEventAPI, 'get').withArgs({
      event_id: 123
    }).shouldGetResultFromEndpoint('/event/123');

    testApiMethod(ExternalEventAPI, 'get')
      .withArgs({})
      .shouldThrowMissingParameterError('event_id');
  });


  describe('#list', function() {
    testApiMethod(ExternalEventAPI, 'list')
      .withArgs({})
      .shouldGetResultFromEndpoint('/event');
  });


  describe('#usages', function() {
    testApiMethod(ExternalEventAPI, 'usages').withArgs({
      event_id: 123
    }).shouldGetResultFromEndpoint('/event/123/usages');

    testApiMethod(ExternalEventAPI, 'usages')
      .withArgs({})
      .shouldThrowMissingParameterError('event_id');
  });


  describe('#trigger', function() {
    testApiMethod(ExternalEventAPI, 'trigger').withArgs({
      event_id: 543,
      data: 'someData'
    }).shouldPostToEndpoint('/event/543/trigger', {
      data: 'someData'
    });
  });

  describe('#update', function() {
    testApiMethod(ExternalEventAPI, 'update').withArgs({
      event_id: 234,
      name: 'someName'
    }).shouldPostToEndpoint('/event/234', {
      name: 'someName'
    });

    testApiMethod(ExternalEventAPI, 'update')
      .withArgs({})
      .shouldThrowMissingParameterError('event_id');
  });

  describe('#delete', function() {
    testApiMethod(ExternalEventAPI, 'delete').withArgs({
      event_id: 234
    }).shouldPostToEndpoint('/event/234/delete', {});

    testApiMethod(ExternalEventAPI, 'delete')
      .withArgs({})
      .shouldThrowMissingParameterError('event_id');
  });

});
