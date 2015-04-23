'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var ApiRequest = require('./');


describe.only('ApiRequest', function () {

  describe('#get', function() {

    it('should call suite request\'s get', function(done) {
      var promiseRespond = {
        data: {
          dummyData: 12
        }
      };
      var suiteServiceRequest = getSuiteRequestResolvesWith(promiseRespond);
      var request = new ApiRequest(suiteServiceRequest);

      request.get('/customers').then(function(returnValue) {
        expect(suiteServiceRequest.get).to.have.been.calledWith('/customers');
        expect(returnValue).to.eql(promiseRespond.data);
      }).then(done);
    });


    it('should throw the sdk error if something went wrong', function(done) {
      var promiseError = new Error('yoError');
      var suiteServiceRequest = getSuiteRequestRejectsWith(promiseError);
      var request = new ApiRequest(suiteServiceRequest);

      request.get('/administrator').catch(function(error) {
        expect(error).to.equal(promiseError);
        done();
      })
    });


    describe('with options', function () {

      it('returns with the full response', function (done) {
        var promiseRespond = {
          data: [1, 2, 3],
          replyCode: 10001
        };
        var suiteServiceRequest = getSuiteRequestResolvesWith(promiseRespond);
        var request = new ApiRequest(suiteServiceRequest);

        request.get('/customers', {rawResponse: true}).then(function(returnValue) {
          expect(suiteServiceRequest.get).to.have.been.calledWith('/customers');
          expect(returnValue).to.eql(promiseRespond);
        }).then(done);
      });

      it('returns with the data only', function (done) {
        var promiseRespond = {
          data: [1, 2, 3],
          replyCode: 10001
        };
        var suiteServiceRequest = getSuiteRequestResolvesWith(promiseRespond);
        var request = new ApiRequest(suiteServiceRequest);

        request.get('/customers').then(function(returnValue) {
          expect(suiteServiceRequest.get).to.have.been.calledWith('/customers');
          expect(returnValue).to.eql(promiseRespond.data);
        }).then(done);
      });
    });

    describe('with caching enabled', function() {
      var firstResponse, secondResponse;

      beforeEach(function() {
        firstResponse = { data: {dummyData: 12} };
        secondResponse = { data: {someNewData: 1} };
      });

      it('should return cached result after the first request', function(done) {
        var suiteServiceRequest = getSuiteRequestResolvesWith(firstResponse);
        var request = new ApiRequest(suiteServiceRequest);
        request.setCache('someCacheId');

        request.get('/administrator').then(function(returnValue) {
          expect(returnValue).to.eql(firstResponse.data);
          suiteServiceRequest.get = sinon.stub().returns(getPromiseResolvesWith(secondResponse));

          request.get('/administrator').then(function(returnValue) {
            expect(returnValue).to.eql(firstResponse.data);
          }).then(done);
        });
      });


      it('should get response from cache for another request with the same cache id', function(done) {
        var suiteServiceRequest = getSuiteRequestResolvesWith(firstResponse);
        var request1 = new ApiRequest(suiteServiceRequest);
        var request2 = new ApiRequest(suiteServiceRequest);
        request1.setCache('someCacheId');
        request2.setCache('someCacheId');

        request1.get('/administrator').then(function(returnValue) {
          expect(returnValue).to.eql(firstResponse.data);
          suiteServiceRequest.get = sinon.stub().returns(getPromiseResolvesWith(secondResponse));

          request2.get('/administrator').then(function(returnValue) {
            expect(returnValue).to.eql(firstResponse.data);
          }).then(done);
        });
      });


      it('should get a new response for a request with another cache id', function(done) {
        var suiteServiceRequest = getSuiteRequestResolvesWith(firstResponse);
        var request1 = new ApiRequest(suiteServiceRequest);
        var request2 = new ApiRequest(suiteServiceRequest);
        request1.setCache('someCacheId1');
        request2.setCache('someCacheId2');

        request1.get('/administrator').then(function(returnValue) {
          expect(returnValue).to.eql(firstResponse.data);
          suiteServiceRequest.get = sinon.stub().returns(getPromiseResolvesWith(secondResponse));

          request2.get('/administrator').then(function(returnValue) {
            expect(returnValue).to.eql(secondResponse.data);
          }).then(done);
        });
      });

    });
  });


  describe('#post', function() {

    it('should call suite request\'s post', function(done) {
      var promiseRespond = { data: {dummyData: 12} };
      var sendData = { yo: 5 };
      var suiteServiceRequest = getSuiteRequestResolvesWith(promiseRespond);
      var request = new ApiRequest(suiteServiceRequest);

      request.post('/administrator', sendData).then(function(returnValue) {
        expect(suiteServiceRequest.post).to.have.been.calledWith('/administrator', sendData);
        expect(returnValue).to.eql(promiseRespond.data);
      }).then(done);
    });


    it('should throw the sdk error if something went wrong', function(done) {
      var promiseError = new Error('yoError');
      var suiteServiceRequest = getSuiteRequestRejectsWith(promiseError);
      var request = new ApiRequest(suiteServiceRequest);

      request.post('/administrator', {}).catch(function(error) {
        expect(error).to.equal(promiseError);
        done();
      });
    });

  });


  describe('#put', function() {

    it('should call suite request\'s put', function(done) {
      var promiseRespond = { data: {dummyData: 12} };
      var sendData = { yo: 5 };
      var suiteServiceRequest = getSuiteRequestResolvesWith(promiseRespond);
      var request = new ApiRequest(suiteServiceRequest);

      request.put('/administrator', sendData).then(function(returnValue) {
        expect(suiteServiceRequest.put).to.have.been.calledWith('/administrator', sendData);
        expect(returnValue).to.eql(promiseRespond.data);
      }).then(done);
    });


    it('should throw the sdk error if something went wrong', function(done) {
      var promiseError = new Error('yoError');
      var suiteServiceRequest = getSuiteRequestRejectsWith(promiseError);
      var request = new ApiRequest(suiteServiceRequest);

      request.put('/administrator', {}).catch(function(error) {
        expect(error).to.equal(promiseError);
        done();
      });
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
      resolve(respObj);
    });
  }

  function getPromiseRejectsWith(error) {
    return new Promise(function(resolve, rejects) {
      rejects(error);
    });
  }

});
