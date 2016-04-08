'use strict';

const KeyringAPI = require('./');
const testApiMethod = require('../_test');

describe('SuiteAPI Keyring endpoint', function() {

  describe('#list', function() {
    testApiMethod(KeyringAPI, 'list').shouldGetResultFromEndpoint('/keyring/keys');
  });

  describe('#get', function() {

    describe('with key_id specified', function() {

      testApiMethod(KeyringAPI, 'get')
        .withArgs({ key_id: 123 })
        .shouldGetResultFromEndpoint('/keyring/keys/123');
    });

    describe('with no key_id specified', function() {

      testApiMethod(KeyringAPI, 'get')
        .withArgs({})
        .shouldThrowMissingParameterError('key_id');
    });
  });

  describe('#create', function() {

    describe('with comment specified', function() {

      testApiMethod(KeyringAPI, 'create')
        .withArgs({ comment: 'MyKeyComment' })
        .shouldPostToEndpoint('/keyring/keys', {
          comment: 'MyKeyComment'
        });
    });

    describe('with no comment specified', function() {

      testApiMethod(KeyringAPI, 'create')
        .withArgs({})
        .shouldThrowMissingParameterError('comment');
    });
  });

  describe('#delete', function() {

    describe('with key_id specified', function() {

      testApiMethod(KeyringAPI, 'delete')
        .withArgs({ key_id: 123 })
        .shouldPostToEndpoint('/keyring/keys/123/delete', {});
    });

    describe('with no key_id specified', function() {

      testApiMethod(KeyringAPI, 'delete')
        .withArgs({})
        .shouldThrowMissingParameterError('key_id');
    });
  });

});
