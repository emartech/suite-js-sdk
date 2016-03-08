'use strict';

var expect = require('chai').expect;
var PasswordGenerator = require('./');

describe('Password Generator', function() {

  it('should contains a lowercased character', function() {
    expect(PasswordGenerator.generate()).to.match(/[a-z]+/);
  });


  it('should contains an uppercased character', function() {
    expect(PasswordGenerator.generate()).to.match(/[A-Z]+/);
  });


  it('should contains a number', function() {
    expect(PasswordGenerator.generate()).to.match(/[0-9]+/);
  });


  it('should contains a special character', function() {
    expect(PasswordGenerator.generate()).to.match(/[^A-Za-z0-9]+/);
  });


  it('should contains the given character length', function() {
    expect(PasswordGenerator.generate(12).length).to.eql(12);
  });


  it('should contains 16 character without a parameter', function() {
    expect(PasswordGenerator.generate().length).to.eql(16);
  });

});
