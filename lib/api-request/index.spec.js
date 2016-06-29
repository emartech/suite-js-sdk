'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var Request = require('./');
var SuiteRequest = require('escher-suiteapi-js');
var _ = require('lodash');

describe('ApiRequest', function() {

  describe('#get', function() {

    it('should urlencode customer name if specified', function(done) {
      assertRequestMethodCalledWithEncodedCustomerName('get', done);
    });

    it('should call suite request\'s get', function(done) {
      var promiseRespond = { dummyData: 12 };

      var getApiRequest = sinon.sandbox.stub(SuiteRequest.prototype, 'get', function() {
        return getPromiseResolvesWith(promiseRespond);
      });

      var request = new Request({});

      request.get(2, '/administrator').then(function(returnValue) {
        expect(getApiRequest).to.have.been.calledWith('/2/administrator');
        expect(returnValue).to.eql(promiseRespond);
      }).then(done).catch(done);
    });


    it('should throw the sdk error if something went wrong', function(done) {
      var promiseError = new Error('yoError');

      sinon.sandbox.stub(SuiteRequest.prototype, 'get', function() {
        return getPromiseRejectsWith(promiseError);
      });

      var request = new Request({});

      request.get(2, '/administrator').then(function() {
        throw new Error('Promise should be rejected');
      }).catch(function(error) {
        expect(error).to.equal(promiseError);
        done();
      });
    });


    it('should use the appropriate keys from the given options object', function(done) {
      var options = {
        some_option: 'should not use',
        environment: 'test_env',
        rejectUnauthorized: false,
        apiKey: 'test_key',
        apiSecret: 'test_secret',
        port: 4321,
        secure: false,
        timeout: 12345
      };
      var expectedOptions = _.omit(options, 'some_option');

      sinon.sandbox.stub(SuiteRequest.prototype, 'get', function() {
        return getPromiseResolvesWith({});
      });
      sinon.sandbox.stub(SuiteRequest.Options, 'createForInternalApi').returns({});

      var request = new Request({});

      request.get(2, '/administrator', options).then(function() {
        expect(SuiteRequest.Options.createForInternalApi).to.have.been.calledWith(expectedOptions);
      }).then(done).catch(done);
    });


    describe('with caching enabled', function() {
      var firstResponse;
      var secondResponse;

      beforeEach(function() {
        firstResponse = { dummyData: 12 };
        secondResponse = { someNewData: 1 };
      });

      it('should return cached result after the first request', function(done) {
        sinon.sandbox.stub(SuiteRequest.prototype, 'get')
          .onFirstCall().returns(getPromiseResolvesWith(firstResponse))
          .onSecondCall().returns(getPromiseResolvesWith(secondResponse));

        var request = new Request({});
        request.setCache('someCacheId');

        request.get(2, '/administrator').then(function(returnValue) {
          expect(returnValue).to.eql(firstResponse);

          request.get(2, '/administrator').then(function(returnValue) {
            expect(returnValue).to.eql(firstResponse);
          }).then(done).catch(done);
        }).catch(done);
      });


      it('should get response from cache for another request with the same cache id', function(done) {
        sinon.sandbox.stub(SuiteRequest.prototype, 'get')
          .onFirstCall().returns(getPromiseResolvesWith(firstResponse))
          .onSecondCall().returns(getPromiseResolvesWith(secondResponse));

        var request1 = new Request({});
        var request2 = new Request({});
        request1.setCache('someCacheId');
        request2.setCache('someCacheId');

        request1.get(2, '/administrator').then(function(returnValue) {
          expect(returnValue).to.eql(firstResponse);

          request2.get(2, '/administrator').then(function(returnValue) {
            expect(returnValue).to.eql(firstResponse);
          }).then(done);
        });
      });


      it('should get a new response for a request with another cache id', function(done) {
        sinon.sandbox.stub(SuiteRequest.prototype, 'get')
          .onFirstCall().returns(getPromiseResolvesWith(firstResponse))
          .onSecondCall().returns(getPromiseResolvesWith(secondResponse));

        var request1 = new Request({});
        var request2 = new Request({});
        request1.setCache('someCacheId1');
        request2.setCache('someCacheId2');

        request1.get(2, '/administrator').then(function(returnValue) {
          expect(returnValue).to.eql(firstResponse);

          request2.get(2, '/administrator').then(function(returnValue) {
            expect(returnValue).to.eql(secondResponse);
          }).then(done).catch(done);
        });
      });


    });
  });


  describe('#post', function() {

    it('should urlencode customer name if specified', function(done) {
      assertRequestMethodCalledWithEncodedCustomerName('post', done);
    });

    it('should call suite request\'s post', function(done) {
      var promiseRespond = { dummyData: 12 };
      var sendData = { yo: 5 };

      var postApiRequest = sinon.sandbox.stub(SuiteRequest.prototype, 'post', function() {
        return getPromiseResolvesWith(promiseRespond);
      });

      var request = new Request({});

      request.post(2, '/administrator', sendData).then(function(returnValue) {
        expect(postApiRequest).to.have.been.calledWith('/2/administrator', sendData);
        expect(returnValue).to.eql(promiseRespond);
      }).then(done).catch(done);
    });


    it('should throw the sdk error if something went wrong', function(done) {
      var promiseError = new Error('yoError');

      sinon.sandbox.stub(SuiteRequest.prototype, 'post', function() {
        return getPromiseRejectsWith(promiseError);
      });

      var request = new Request({});

      request.post(2, '/administrator', {}).catch(function(error) {
        expect(error).to.equal(promiseError);
        done();
      });
    });

  });


  describe('#put', function() {

    it('should urlencode customer name if specified', function(done) {
      assertRequestMethodCalledWithEncodedCustomerName('put', done);
    });

    it('should call suite request\'s put', function(done) {
      var promiseRespond = { dummyData: 12 };
      var sendData = { yo: 5 };

      var putApiRequest = sinon.sandbox.stub(SuiteRequest.prototype, 'put', function() {
        return getPromiseResolvesWith(promiseRespond);
      });

      var request = new Request({});

      request.put(2, '/administrator', sendData).then(function(returnValue) {
        expect(putApiRequest).to.have.been.calledWith('/2/administrator', sendData);
        expect(returnValue).to.eql(promiseRespond);
      }).then(done);
    });


    it('should throw the sdk error if something went wrong', function(done) {
      var promiseError = new Error('yoError');
      sinon.sandbox.stub(SuiteRequest.prototype, 'put', function() {
        return getPromiseRejectsWith(promiseError);
      });
      var request = new Request({});

      request.put(2, '/administrator', {}).catch(function(error) {
        expect(error).to.equal(promiseError);
        done();
      });
    });

  });

  var getPromiseResolvesWith = function(respObj) {
    return new Promise(function(resolve) {
      resolve(respObj);
    });
  };

  var getPromiseRejectsWith = function(error) {
    /*eslint-disable*/
    return new Promise(function(resolve, rejects) {
      rejects(error);
    });
    /*eslint-enable*/
  };

  var assertRequestMethodCalledWithEncodedCustomerName = function(requestMethod, done) {
    var apiRequest = sinon.sandbox.stub(SuiteRequest.prototype, requestMethod, function() {
      return getPromiseResolvesWith({});
    });

    var request = new Request({});
    request[requestMethod]('name:user name', '/administrator').then(function() {
      expect(apiRequest).to.have.been.calledWith('/name:user%20name/administrator');
    }).then(done).catch(done);
  };

});
