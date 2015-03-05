'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var Request = require('./');


describe('Request', function () {

  describe('#get', function() {

    it('should call suite request\'s get', function(done) {
      var promiseRespond = { dummyData: 12 };
      var suiteRequest = getSuiteRequestResolvesWith(promiseRespond);
      var request = new Request(suiteRequest);

      request.get(2, '/administrator').then(function(returnValue) {
        expect(suiteRequest.get).to.have.been.calledWith('/2/administrator');
        expect(returnValue).to.eql(promiseRespond);
      }).then(done);
    });


    it('should throw the sdk error if something went wrong', function(done) {
      var promiseError = new Error('yoError');
      var suiteRequest = getSuiteRequestRejectsWith(promiseError);
      var request = new Request(suiteRequest);

      request.get(2, '/administrator').catch(function(error) {
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
        var suiteRequest = getSuiteRequestResolvesWith(firstResponse);
        var request = new Request(suiteRequest);
        request.setCache('someCacheId');

        request.get(2, '/administrator').then(function(returnValue) {
          expect(returnValue).to.eql(firstResponse);
          suiteRequest.get = sinon.stub().returns(getPromiseResolvesWith(secondResponse));

          request.get(2, '/administrator').then(function(returnValue) {
            expect(returnValue).to.eql(firstResponse);
          }).then(done);
        });
      });


      it('should get response from cache for another request with the same cache id', function(done) {
        var suiteRequest = getSuiteRequestResolvesWith(firstResponse);
        var request1 = new Request(suiteRequest);
        var request2 = new Request(suiteRequest);
        request1.setCache('someCacheId');
        request2.setCache('someCacheId');

        request1.get(2, '/administrator').then(function(returnValue) {
          expect(returnValue).to.eql(firstResponse);
          suiteRequest.get = sinon.stub().returns(getPromiseResolvesWith(secondResponse));

          request2.get(2, '/administrator').then(function(returnValue) {
            expect(returnValue).to.eql(firstResponse);
          }).then(done);
        });
      });


      it('should get a new response for a request with another cache id', function(done) {
        var suiteRequest = getSuiteRequestResolvesWith(firstResponse);
        var request1 = new Request(suiteRequest);
        var request2 = new Request(suiteRequest);
        request1.setCache('someCacheId1');
        request2.setCache('someCacheId2');

        request1.get(2, '/administrator').then(function(returnValue) {
          expect(returnValue).to.eql(firstResponse);
          suiteRequest.get = sinon.stub().returns(getPromiseResolvesWith(secondResponse));

          request2.get(2, '/administrator').then(function(returnValue) {
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
      var suiteRequest = getSuiteRequestResolvesWith(promiseRespond);
      var request = new Request(suiteRequest);

      request.post(2, '/administrator', sendData).then(function(returnValue) {
        expect(suiteRequest.post).to.have.been.calledWith('/2/administrator', sendData);
        expect(returnValue).to.eql(promiseRespond);
      }).then(done);
    });


    it('should throw the sdk error if something went wrong', function(done) {
      var promiseError = new Error('yoError');
      var suiteRequest = getSuiteRequestRejectsWith(promiseError);
      var request = new Request(suiteRequest);

      request.post(2, '/administrator', {}).catch(function(error) {
        expect(error).to.equal(promiseError);
        done();
      })
    });

  });


  describe('#put', function() {

    it('should call suite request\'s put', function(done) {
      var promiseRespond = { dummyData: 12 };
      var sendData = { yo: 5 };
      var suiteRequest = getSuiteRequestResolvesWith(promiseRespond);
      var request = new Request(suiteRequest);

      request.put(2, '/administrator', sendData).then(function(returnValue) {
        expect(suiteRequest.put).to.have.been.calledWith('/2/administrator', sendData);
        expect(returnValue).to.eql(promiseRespond);
      }).then(done);
    });


    it('should throw the sdk error if something went wrong', function(done) {
      var promiseError = new Error('yoError');
      var suiteRequest = getSuiteRequestRejectsWith(promiseError);
      var request = new Request(suiteRequest);

      request.put(2, '/administrator', {}).catch(function(error) {
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
      resolve({ data: { data: respObj } });
    });
  }

  function getPromiseRejectsWith(error) {
    return new Promise(function(resolve, rejects) {
      rejects(error);
    });
  }

});
