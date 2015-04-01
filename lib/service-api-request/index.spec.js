'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var ServiceRequest = require('./');


describe('ServiceRequest', function () {

  describe('#get', function() {

    it('should call suite request\'s get', function(done) {
      var promiseRespond = { dummyData: 12 };
      var suiteServiceRequest = getSuiteRequestResolvesWith(promiseRespond);
      var request = new ServiceRequest(suiteServiceRequest);

      request.get('/customers').then(function(returnValue) {
        expect(suiteServiceRequest.get).to.have.been.calledWith('/customers');
        expect(returnValue).to.eql(promiseRespond);
      }).then(done);
    });


    it('should throw the sdk error if something went wrong', function(done) {
      var promiseError = new Error('yoError');
      var suiteServiceRequest = getSuiteRequestRejectsWith(promiseError);
      var request = new ServiceRequest(suiteServiceRequest);

      request.get('/administrator').catch(function(error) {
        expect(error).to.equal(promiseError);
        done();
      })
    });



    describe('with caching enabled', function() {
      var firstResponse, secondResponse;

      beforeEach(function() {
        firstResponse = { dummyData: 12 };
        secondResponse = { someNewData: 1 };
      });

      it('should return cached result after the first request', function(done) {
        var suiteServiceRequest = getSuiteRequestResolvesWith(firstResponse);
        var request = new ServiceRequest(suiteServiceRequest);
        request.setCache('someCacheId');

        request.get('/administrator').then(function(returnValue) {
          expect(returnValue).to.eql(firstResponse);
          suiteServiceRequest.get = sinon.stub().returns(getPromiseResolvesWith(secondResponse));

          request.get('/administrator').then(function(returnValue) {
            expect(returnValue).to.eql(firstResponse);
          }).then(done);
        });
      });


      it('should get response from cache for another request with the same cache id', function(done) {
        var suiteServiceRequest = getSuiteRequestResolvesWith(firstResponse);
        var request1 = new ServiceRequest(suiteServiceRequest);
        var request2 = new ServiceRequest(suiteServiceRequest);
        request1.setCache('someCacheId');
        request2.setCache('someCacheId');

        request1.get('/administrator').then(function(returnValue) {
          expect(returnValue).to.eql(firstResponse);
          suiteServiceRequest.get = sinon.stub().returns(getPromiseResolvesWith(secondResponse));

          request2.get('/administrator').then(function(returnValue) {
            expect(returnValue).to.eql(firstResponse);
          }).then(done);
        });
      });


      it('should get a new response for a request with another cache id', function(done) {
        var suiteServiceRequest = getSuiteRequestResolvesWith(firstResponse);
        var request1 = new ServiceRequest(suiteServiceRequest);
        var request2 = new ServiceRequest(suiteServiceRequest);
        request1.setCache('someCacheId1');
        request2.setCache('someCacheId2');

        request1.get('/administrator').then(function(returnValue) {
          expect(returnValue).to.eql(firstResponse);
          suiteServiceRequest.get = sinon.stub().returns(getPromiseResolvesWith(secondResponse));

          request2.get('/administrator').then(function(returnValue) {
            expect(returnValue).to.eql(secondResponse);
          }).then(done);
        });
      });




    });
  });


  describe('#post', function() {

    it('should call suite request\'s post', function(done) {
      var promiseRespond = { dummyData: 12 };
      var sendData = { yo: 5 };
      var suiteServiceRequest = getSuiteRequestResolvesWith(promiseRespond);
      var request = new ServiceRequest(suiteServiceRequest);

      request.post('/administrator', sendData).then(function(returnValue) {
        expect(suiteServiceRequest.post).to.have.been.calledWith('/administrator', sendData);
        expect(returnValue).to.eql(promiseRespond);
      }).then(done);
    });


    it('should throw the sdk error if something went wrong', function(done) {
      var promiseError = new Error('yoError');
      var suiteServiceRequest = getSuiteRequestRejectsWith(promiseError);
      var request = new ServiceRequest(suiteServiceRequest);

      request.post('/administrator', {}).catch(function(error) {
        expect(error).to.equal(promiseError);
        done();
      })
    });

  });


  describe('#put', function() {

    it('should call suite request\'s put', function(done) {
      var promiseRespond = { dummyData: 12 };
      var sendData = { yo: 5 };
      var suiteServiceRequest = getSuiteRequestResolvesWith(promiseRespond);
      var request = new ServiceRequest(suiteServiceRequest);

      request.put('/administrator', sendData).then(function(returnValue) {
        expect(suiteServiceRequest.put).to.have.been.calledWith('/administrator', sendData);
        expect(returnValue).to.eql(promiseRespond);
      }).then(done);
    });


    it('should throw the sdk error if something went wrong', function(done) {
      var promiseError = new Error('yoError');
      var suiteServiceRequest = getSuiteRequestRejectsWith(promiseError);
      var request = new ServiceRequest(suiteServiceRequest);

      request.put('/administrator', {}).catch(function(error) {
        expect(error).to.equal(promiseError);
        done();
      })
    });

  });

  function getSuiteRequestResolvesWith(respObj) {
    var respPromise = getPromiseResolvesWith(respObj);

    return {
      get: sinon.stub().returns(respPromise),
      post: sinon.stub().returns(respPromise),
      put: sinon.stub().returns(respPromise)
    };
  }


  function getSuiteRequestRejectsWith(error) {
    var respPromise = getPromiseRejectsWith(error);

    return {
      get: sinon.stub().returns(respPromise),
      post: sinon.stub().returns(respPromise),
      put: sinon.stub().returns(respPromise)
    };
  }

  function getPromiseResolvesWith(respObj) {
    return new Promise(function(resolve) {
      resolve({ data: respObj });
    });
  }

  function getPromiseRejectsWith(error) {
    return new Promise(function(resolve, rejects) {
      rejects(error);
    });
  }

});
