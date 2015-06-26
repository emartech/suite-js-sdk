'use strict';

var expect = require('chai').expect;
var BaseApi = require('./');

describe('Suite Base Api', function() {

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

      base.customerId = 3;

      expect(base._getCustomerId()).to.be.eql(3);
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

});
