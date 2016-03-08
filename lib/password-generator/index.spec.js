'use strict';

const expect = require('chai').expect;
const PasswordGenerator = require('./');

describe('Password Generator', function() {

  describe('generated passwords', function() {

    it('should contain a lowercased character', function() {
      expect(PasswordGenerator.generate()).to.match(/[a-z]+/);
    });


    it('should contain an uppercased character', function() {
      expect(PasswordGenerator.generate()).to.match(/[A-Z]+/);
    });


    it('should contain a number', function() {
      expect(PasswordGenerator.generate()).to.match(/[0-9]+/);
    });


    it('should contain a special character', function() {

      expect(PasswordGenerator.generate()).to.match(/[^A-Za-z0-9]+/);
    });


    it('should contain the given character length', function() {
      expect(PasswordGenerator.generate(12).length).to.eql(12);
    });


    it('should contain 16 character without a parameter', function() {
      expect(PasswordGenerator.generate().length).to.eql(16);
    });

  });

});
