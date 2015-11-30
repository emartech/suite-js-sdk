'use strict';

var sinon = require('sinon');
var expect = require('chai').expect;
var dateHelper = require('./');

describe('Date helper', function() {

  describe('#getCurrentDate', function() {

    var actualTime;

    beforeEach(function() {
      actualTime = 915148861000;
      sinon.useFakeTimers(actualTime, 'Date');
    });

    it('should gives back the current date with the proper format', function() {
      var converted = dateHelper.getCurrentDate();

      expect(converted).to.eql('1999-01-01 00:01:01');
    });

  });

});
