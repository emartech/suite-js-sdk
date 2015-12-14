'use strict';

var expect = require('chai').expect;
var BaseApi = require('./');

describe('Suite Base Api Endpoint', function() {

  describe('returns the customerId', function() {

    it('when set in the constructor', function() {
      var base = new BaseApi({
        customerId: 4
      });

      expect(base._getCustomerId()).to.be.eql(4);
    });

    it('when set in options', function() {
      var base = new BaseApi({
        customerId: 4
      });

      var resultCustomerId = base._getCustomerId({ customerId: 3 });

      expect(resultCustomerId).to.be.eql(3);
    });

  });

  it('filters the payload object', function() {

    var base = new BaseApi();

    var payload = base._cleanPayload({
      emailId: 2,
      text: 'such an email'
    }, ['emailId']);

    expect(payload).to.be.eql({
      text: 'such an email'
    });
  });

  describe('builds a query string', function() {
    it('from an empty object', function() {
      var base = new BaseApi();

      var url = base._buildUrl('/a', {});

      expect(url).to.be.eql('/a');
    });

    it('from a non-empty object', function() {
      var base = new BaseApi();

      var url = base._buildUrl('/a', { b: 1 });

      expect(url).to.be.eql('/a/?b=1');
    });
  });

  describe('builds a query string for segmentation', function() {
    it('from an empty object', function() {
      var base = new BaseApi();

      var url = base._buildUrlForSegmentation('/a', {});

      expect(url).to.be.eql('/a');
    });

    it('from a non-empty object', function() {
      var base = new BaseApi();

      var url = base._buildUrlForSegmentation('/a', { b: 1 });

      expect(url).to.be.eql('/a/b=1');
    });
  });

});
