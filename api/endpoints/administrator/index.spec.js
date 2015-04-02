'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var AdministratorAPI = require('./');
var _ = require('lodash');
var apiTest = require('../../../test-helper');
var PasswordGenerator = require('../../../lib/password-generator');
var DateHelper = require('../../../lib/date-helper');


describe('Suite Customer', function() {
  var customer;
  var request;

  var sdkMethods = {
    getAdministrators: {
      method: 'get',
      expectedUrl: '/administrator'
    },

    getInterfaceLanguages: {
      method: 'get',
      expectedUrl: '/administrator/getinterfacelanguages'
    },

    getAccessLevels: {
      method: 'get',
      expectedUrl: '/administrator/getaccesslevels'
    },

    patchAdministrator: {
      method: 'post',
      expectedUrl: '/administrator/12/patch',
      arguments: [12],
      payload: { someData: 1 },
      expectedPayload: { someData: 1 }
    }
  };

  apiTest.testSDKMethodResponse(AdministratorAPI, sdkMethods);


  var computedSdkMethods = {
    getAdministrator: [{
      name: 'error 400 if the server respond without that administrator',
      arguments: [12, '11'],
      promiseRespondWith: [{ id: '1', superadmin: '0' }],
      expectedUrl: '/administrator',
      expectedErrorCode: 400
    }, {
      name: 'with the administrator',
      arguments: [12, '3'],
      promiseRespondWith: [{ id: '1', superadmin: '0' }, { id: '2', superadmin: '1' }, { id: '3', superadmin: '0' }],
      expectedUrl: '/administrator',
      expectedResponse: { id: '3', superadmin: '0' }
    }],

    getAdministratorByName: [{
      name: 'with administrator name',
      arguments: ['name:TestCustomer', 'adminName'],
      promiseRespondWith: [{ id: '1', username: 'adminName', email: 'kalman@email.com' },
        { id: '2', username: 'adminName2', email: 'kalman2@email.com' }],
      expectedUrl: '/administrator',
      expectedResponse: { id: '1', username: 'adminName', email: 'kalman@email.com' }
    }, {
      name: 'error 400 if the server respond without that administrator',
      arguments: ['name:TestCustomer', 'NOT_FOUND'],
      promiseRespondWith: [{ id: '1', username: 'adminName', email: 'kalman@email.com' },
        { id: '2', username: 'adminName2', email: 'kalman2@email.com' }],
      expectedUrl: '/administrator',
      expectedErrorCode: 400
    }],

    getSuperadmin: [{
      name: 'error 400 if the server respond without a superadmin',
      arguments: [12],
      promiseRespondWith: [],
      expectedUrl: '/administrator',
      expectedErrorCode: 400
    }, {
      name: 'with the superadmin',
      arguments: [12],
      promiseRespondWith: [{ id: '1', superadmin: '0' }, { id: '2', superadmin: '1' }],
      expectedUrl: '/administrator',
      expectedResponse: { id: '2', superadmin: '1' }
    }]
  };

  _.forIn(computedSdkMethods, function(testCases, sdkMethod) {

    describe('#' + sdkMethod, function() {

      _.each(testCases, function(testCase) {

        it('should return with ' + testCase.name, function(done) {
          requestPromiseRespondWith(testCase.promiseRespondWith);

          customer[sdkMethod].apply(customer, testCase.arguments)
            .then(expectationHandler)
            .catch(expectationHandler);

          function expectationHandler(data) {
            if (testCase.expectedErrorCode) {
              expect(data.code).to.be.eql(testCase.expectedErrorCode);
            } else {
              expect(data).to.be.eql(testCase.expectedResponse);
            }
            expect(request.get).to.have.been.calledWith(testCase.arguments[0], testCase.expectedUrl);
            done();
          }
        });

      });

    });

  });

  describe('additional methods', function() {

    beforeEach(function() {
      this.sandbox.stub(PasswordGenerator, 'generate');
      this.sandbox.stub(DateHelper, 'getCurrentDate');
    });


    describe('#createAdministrator', function() {

      it('should create an admin as an inactivated superadmin by a Suite api call', function* () {
        requestPromiseRespondWith('returnedFromPost');
        var returnValue = yield customer.createAdministrator(12);

        expect(request.post).to.have.been.calledWithMatch(12, '/administrator', { disabled: 1 });
        expect(returnValue).to.eql('returnedFromPost');
      });


      it('should send additional properties', function* () {
        requestPromiseRespondWith();
        yield customer.createAdministrator(12, {
          first_name: 'fname',
          last_name: 'lname'
        });

        expect(request.post).to.have.been.calledWithMatch(12, '/administrator/', {
          disabled: 1,
          first_name: 'fname',
          last_name: 'lname'
        });
      });


      it('should send default values for hidden mandatory fields', function* () {
        requestPromiseRespondWith();
        PasswordGenerator.generate.returns('test!!!Password');
        DateHelper.getCurrentDate.returns('1999-01-01 01:01');

        yield customer.createAdministrator(12, {});

        expect(request.post).to.have.been.calledWithMatch(12, '/administrator/', {
          access_level: 0,
          interface_language: 'en',
          superadmin: 0,
          disabled: 1,
          password: 'test!!!Password',
          last_verification_action_date: '1999-01-01 01:01'
        });
      });

    });


    describe('#createSuperadmin', function() {


      it('should create administrator by a Suite api call', function* () {
        requestPromiseRespondWith();
        PasswordGenerator.generate.returns('test!!!Password');
        DateHelper.getCurrentDate.returns('1999-01-01 01:01');

        yield customer.createSuperadmin(12, {
          first_name: 'fname',
          last_name: 'lname',
          disabled: 0
        });

        expect(request.post).to.have.been.calledWithMatch(12, '/administrator/', {
          first_name: 'fname',
          last_name: 'lname',
          access_level: 0,
          interface_language: 'en',
          superadmin: 1,
          disabled: 1,
          password: 'test!!!Password',
          last_verification_action_date: '1999-01-01 01:01'
        });
      });

    });


    describe('#enable', function() {

      it('should enable the given admin by a Suite api call', function* () {
        requestPromiseRespondWith('returnedFromPost');
        DateHelper.getCurrentDate.returns('1999-01-01 01:01');
        var returnValue = yield customer.enable(12, 4);

        expect(request.post).to.have.been.calledWithMatch(12, '/administrator/4/patch', {
          disabled: 0,
          last_verification_action_date: '1999-01-01 01:01'
        });
        expect(returnValue).to.eql('returnedFromPost');
      });

    });


    describe('#disable', function() {

      it('should disable the given admin by a Suite api call', function* () {
        requestPromiseRespondWith('returnedFromPost');
        DateHelper.getCurrentDate.returns('1999-01-01 01:01');
        var returnValue = yield customer.disableAdministrator(12, 4);

        expect(request.post).to.have.been.calledWith(12, '/administrator/4/patch', {
          disabled: 1,
          last_verification_action_date: '1999-01-01 01:01'
        });
        expect(returnValue).to.eql('returnedFromPost');
      });

    });


    describe('#deleteAdministrator', function() {

      it('should delete the given admin by a Suite api call', function* () {
        requestPromiseRespondWith('returnedFromPost');
        DateHelper.getCurrentDate.returns('1999-01-01 01:01');
        var returnValue = yield customer.deleteAdministrator(12, 4, 5);


        expect(request.post).to.have.been.calledWith(12, '/administrator/4/delete', {
          administratorId: 4,
          successor_administrator_id: 5
        });
        expect(returnValue).to.eql('returnedFromPost');
      });

    });


    describe('#promoteToSuperadmin', function () {

      it('should promote an admin to superadmin and inactivate it by a Suite api call', function* () {
        requestPromiseRespondWith('returnedFromPost');
        var returnValue = yield customer.promoteToSuperadmin(12, 21);
        expect(request.post).to.have.been.calledWithMatch(12, '/administrator/21/patch', { superadmin: 1, disabled: 1 });
        expect(returnValue).to.eql('returnedFromPost');
      });


      it('should send additional properties', function* () {
        requestPromiseRespondWith();
        yield customer.promoteToSuperadmin(12, 21, {
          first_name: 'fname',
          last_name: 'lname'
        });

        expect(request.post).to.have.been.calledWithMatch(12, '/administrator/21/patch', {
          superadmin: 1,
          disabled: 1,
          access_level: 0,
          first_name: 'fname',
          last_name: 'lname'
        });
      });


      it('should create a new administrator password', function* () {
        requestPromiseRespondWith();
        PasswordGenerator.generate.returns('test!!!Password');

        yield customer.promoteToSuperadmin(12, 21);

        expect(request.post).to.have.been.calledWithMatch(12, '/administrator/21/patch', {
          password: 'test!!!Password'
        });
      });


      it('should send date now as last verification action date', function* () {
        requestPromiseRespondWith();
        DateHelper.getCurrentDate.returns('1999-01-01 01:01');

        yield customer.promoteToSuperadmin(12, 21, {
          last_verification_action_date: '2021-12-12 12:12'
        });

        expect(request.post).to.have.been.calledWithMatch(12, '/administrator/21/patch', {
          last_verification_action_date: '1999-01-01 01:01'
        });
      });

    });


    describe('#inviteExistingAdministrator', function () {

      it('should invite an admin and inactivate it by a Suite api call', function* () {
        requestPromiseRespondWith('returnedFromPost');
        var returnValue = yield customer.inviteExistingAdministrator(12, 21);
        expect(request.post).to.have.been.calledWithMatch(12, '/administrator/21/patch', { disabled: 1 });
        expect(returnValue).to.eql('returnedFromPost');
      });


      it('should send additional properties', function* () {
        requestPromiseRespondWith();
        yield customer.inviteExistingAdministrator(12, 21, {
          first_name: 'fname',
          last_name: 'lname'
        });

        expect(request.post).to.have.been.calledWithMatch(12, '/administrator/21/patch', {
          disabled: 1,
          first_name: 'fname',
          last_name: 'lname'
        });
      });


      it('should create a new administrator password', function* () {
        requestPromiseRespondWith();
        PasswordGenerator.generate.returns('test!!!Password');

        yield customer.inviteExistingAdministrator(12, 21);

        expect(request.post).to.have.been.calledWithMatch(12, '/administrator/21/patch', {
          password: 'test!!!Password'
        });
      });


      it('should send date now as last verification action date', function* () {
        requestPromiseRespondWith();
        DateHelper.getCurrentDate.returns('1999-01-01 01:01');

        yield customer.promoteToSuperadmin(12, 21, {
          last_verification_action_date: '2021-12-12 12:12'
        });

        expect(request.post).to.have.been.calledWithMatch(12, '/administrator/21/patch', {
          last_verification_action_date: '1999-01-01 01:01'
        });
      });

    });

  });



  function requestPromiseRespondWith(respObj) {
    var respPromise = new Promise(function(resolve) {
      resolve(respObj);
    });

    request = {
      get: sinon.stub().returns(respPromise),
      post: sinon.stub().returns(respPromise)
    };
    customer = new AdministratorAPI(request);
  }

});
