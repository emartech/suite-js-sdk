'use strict';

var Request = require('./');
const { EscherRequest, EscherRequestOption, EscherRequestError } = require('@emartech/escher-request');
const SuiteRequestError = require('./error');
var _ = require('lodash');

describe('ApiRequest', function() {

  describe('#get', function() {

    it('should urlencode customer name if specified', function(done) {
      assertRequestMethodCalledWithEncodedCustomerName('get', done);
    });

    it('should call suite request\'s get', function(done) {
      var promiseRespond = { dummyData: 12 };

      var getApiRequest = sinon.stub(EscherRequest.prototype, 'get').callsFake(function() {
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

      sinon.stub(EscherRequest.prototype, 'get').callsFake(function() {
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

    it('should map EscherRequestError to SuiteRequestError', function(done) {
      var promiseError = new EscherRequestError('yoError', 499, { foo: 'bar' }, 'ECONNABORTED');

      sinon.stub(EscherRequest.prototype, 'get').callsFake(function() {
        return getPromiseRejectsWith(promiseError);
      });

      var request = new Request({});

      request.get(2, '/administrator').then(function() {
        throw new Error('Promise should be rejected');
      }).catch(function(error) {
        expect(error).to.be.an.instanceOf(SuiteRequestError);
        expect(error.message).to.equal(promiseError.message);
        expect(error.code).to.equal(promiseError.code);
        expect(error.data).to.equal(promiseError.data);
        expect(error.originalCode).to.equal(promiseError.originalCode);
      }).then(done).catch(done);
    });


    it('should use the appropriate keys from the given options object', function(done) {
      var options = getDefaultOptions();
      var expectedOptions = _.chain(options)
        .omit(['some_option', 'environment'])
        .assign({ host: options.environment })
        .value();

      sinon.stub(EscherRequest.prototype, 'get').callsFake(function() {
        return getPromiseResolvesWith({});
      });
      sinon.stub(EscherRequestOption, 'createForInternalApi').returns({});

      var request = new Request({});

      request.get(2, '/administrator', options).then(function() {
        expect(EscherRequestOption.createForInternalApi).to.have.been.calledWith(expectedOptions);
      }).then(done).catch(done);
    });


    it('should use the initial config', function(done) {
      var options = getDefaultOptions();
      var expectedOptions = _.chain(options)
        .omit(['some_option', 'environment'])
        .assign({ host: options.environment })
        .value();

      sinon.stub(EscherRequest.prototype, 'get').callsFake(function() {
        return getPromiseResolvesWith({});
      });
      sinon.stub(EscherRequestOption, 'createForInternalApi').returns({});

      var request = new Request(options);

      request.get(2, '/administrator').then(function() {
        expect(EscherRequestOption.createForInternalApi).to.have.been.calledWith(expectedOptions);
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
        sinon.stub(EscherRequest.prototype, 'get')
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
        sinon.stub(EscherRequest.prototype, 'get')
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
        sinon.stub(EscherRequest.prototype, 'get')
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

      var postApiRequest = sinon.stub(EscherRequest.prototype, 'post').callsFake(function() {
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

      sinon.stub(EscherRequest.prototype, 'post').callsFake(function() {
        return getPromiseRejectsWith(promiseError);
      });

      var request = new Request({});

      request.post(2, '/administrator', {}).catch(function(error) {
        expect(error).to.equal(promiseError);
        done();
      });
    });

    it('should map EscherRequestError to SuiteRequestError', function(done) {
      var promiseError = new EscherRequestError('yoError', 499, { foo: 'bar' }, 'ECONNABORTED');

      sinon.stub(EscherRequest.prototype, 'post').callsFake(function() {
        return getPromiseRejectsWith(promiseError);
      });

      var request = new Request({});

      request.post(2, '/administrator', {}).then(function() {
        throw new Error('Promise should be rejected');
      }).catch(function(error) {
        expect(error).to.be.an.instanceOf(SuiteRequestError);
        expect(error.message).to.equal(promiseError.message);
        expect(error.code).to.equal(promiseError.code);
        expect(error.data).to.equal(promiseError.data);
        expect(error.originalCode).to.equal(promiseError.originalCode);
      }).then(done).catch(done);
    });


    it('should use the appropriate keys from the given options object', function(done) {
      testRequestOptionSetupMethodParameter('post', done);
    });


    it('should use the initial config', function(done) {
      testRequestOptionSetupConstructorParameter('post', done);
    });

  });


  describe('#put', function() {

    it('should urlencode customer name if specified', function(done) {
      assertRequestMethodCalledWithEncodedCustomerName('put', done);
    });

    it('should call suite request\'s put', function(done) {
      var promiseRespond = { dummyData: 12 };
      var sendData = { yo: 5 };

      var putApiRequest = sinon.stub(EscherRequest.prototype, 'put').callsFake(function() {
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
      sinon.stub(EscherRequest.prototype, 'put').callsFake(function() {
        return getPromiseRejectsWith(promiseError);
      });
      var request = new Request({});

      request.put(2, '/administrator', {}).catch(function(error) {
        expect(error).to.equal(promiseError);
        done();
      });
    });

    it('should map EscherRequestError to SuiteRequestError', function(done) {
      var promiseError = new EscherRequestError('yoError', 499, { foo: 'bar' }, 'ECONNABORTED');

      sinon.stub(EscherRequest.prototype, 'put').callsFake(function() {
        return getPromiseRejectsWith(promiseError);
      });

      var request = new Request({});

      request.put(2, '/administrator', {}).then(function() {
        throw new Error('Promise should be rejected');
      }).catch(function(error) {
        expect(error).to.be.an.instanceOf(SuiteRequestError);
        expect(error.message).to.equal(promiseError.message);
        expect(error.code).to.equal(promiseError.code);
        expect(error.data).to.equal(promiseError.data);
        expect(error.originalCode).to.equal(promiseError.originalCode);
      }).then(done).catch(done);
    });


    it('should use the appropriate keys from the given options object', function(done) {
      testRequestOptionSetupMethodParameter('put', done);
    });


    it('should use the initial config', function(done) {
      testRequestOptionSetupConstructorParameter('put', done);
    });

  });

  describe('#delete', function() {

    it('should urlencode customer name if specified', function(done) {
      assertRequestMethodCalledWithEncodedCustomerName('put', done);
    });

    it('should call suite request\'s delete', function(done) {
      var promiseRespond = { dummyData: 12 };

      var putApiRequest = sinon.stub(EscherRequest.prototype, 'delete').callsFake(function() {
        return getPromiseResolvesWith(promiseRespond);
      });

      var request = new Request({});

      request.delete(2, '/administrator').then(function(returnValue) {
        expect(putApiRequest).to.have.been.calledWith('/2/administrator');
        expect(returnValue).to.eql(promiseRespond);
      }).then(done);
    });


    it('should throw the sdk error if something went wrong', function(done) {
      var promiseError = new Error('yoError');
      sinon.stub(EscherRequest.prototype, 'delete').callsFake(function() {
        return getPromiseRejectsWith(promiseError);
      });
      var request = new Request({});

      request.delete(2, '/administrator', {}).catch(function(error) {
        expect(error).to.equal(promiseError);
        done();
      });
    });

    it('should map EscherRequestError to SuiteRequestError', function(done) {
      var promiseError = new EscherRequestError('yoError', 499, { foo: 'bar' }, 'ECONNABORTED');

      sinon.stub(EscherRequest.prototype, 'delete').callsFake(function() {
        return getPromiseRejectsWith(promiseError);
      });

      var request = new Request({});

      request.delete(2, '/administrator', {}).then(function() {
        throw new Error('Promise should be rejected');
      }).catch(function(error) {
        expect(error).to.be.an.instanceOf(SuiteRequestError);
        expect(error.message).to.equal(promiseError.message);
        expect(error.code).to.equal(promiseError.code);
        expect(error.data).to.equal(promiseError.data);
        expect(error.originalCode).to.equal(promiseError.originalCode);
      }).then(done).catch(done);
    });


    it('should use the appropriate keys from the given options object', function(done) {
      var options = getDefaultOptions();
      var expectedOptions = _.chain(options)
        .omit(['some_option', 'environment'])
        .assign({ host: options.environment })
        .value();

      sinon.stub(EscherRequest.prototype, 'delete').callsFake(function() {
        return getPromiseResolvesWith({});
      });
      sinon.stub(EscherRequestOption, 'createForInternalApi').returns({});

      var request = new Request({});

      request.delete(2, '/administrator', options).then(function() {
        expect(EscherRequestOption.createForInternalApi).to.have.been.calledWith(expectedOptions);
      }).then(done).catch(done);
    });


    it('should use the initial config', function(done) {
      testRequestOptionSetupConstructorParameter('delete', done);
    });

  });

  beforeEach(function() {
    getPromiseResolvesWith = getPromiseResolvesWith.bind(this);
    getPromiseRejectsWith = getPromiseRejectsWith.bind(this);
    assertRequestMethodCalledWithEncodedCustomerName = assertRequestMethodCalledWithEncodedCustomerName.bind(this);
    testRequestOptionSetupConstructorParameter = testRequestOptionSetupConstructorParameter.bind(this);
    testRequestOptionSetupMethodParameter = testRequestOptionSetupMethodParameter.bind(this);
    getDefaultOptions = getDefaultOptions.bind(this);
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
    var apiRequest = sinon.stub(EscherRequest.prototype, requestMethod).callsFake(function() {
      return getPromiseResolvesWith({});
    });

    var request = new Request({});
    request[requestMethod]('name:user name', '/administrator').then(function() {
      expect(apiRequest).to.have.been.calledWith('/name:user%20name/administrator');
    }).then(done).catch(done);
  };

  var testRequestOptionSetupConstructorParameter = function(requestMethod, done) {
    var options = getDefaultOptions();
    var expectedOptions = _.chain(options)
      .omit(['some_option', 'environment'])
      .assign({ host: options.environment })
      .value();

    sinon.stub(EscherRequest.prototype, requestMethod).callsFake(function() {
      return getPromiseResolvesWith({});
    });
    sinon.stub(EscherRequestOption, 'createForInternalApi').returns({});

    var request = new Request(options);

    request[requestMethod](2, '/administrator', null).then(function() {
      expect(EscherRequestOption.createForInternalApi).to.have.been.calledWith(expectedOptions);
    }).then(done).catch(done);
  };

  var testRequestOptionSetupMethodParameter = function(requestMethod, done) {
    var options = getDefaultOptions();
    var expectedOptions = _.chain(options)
      .omit(['some_option', 'environment'])
      .assign({ host: options.environment })
      .value();

    sinon.stub(EscherRequest.prototype, requestMethod).callsFake(function() {
      return getPromiseResolvesWith({});
    });
    sinon.stub(EscherRequestOption, 'createForInternalApi').returns({});

    var request = new Request({});

    request[requestMethod](2, '/administrator', null, options).then(function() {
      expect(EscherRequestOption.createForInternalApi).to.have.been.calledWith(expectedOptions);
    }).then(done).catch(done);
  };

  var getDefaultOptions = function() {
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
    return options;
  };


});
