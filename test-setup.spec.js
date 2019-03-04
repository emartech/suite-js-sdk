'use strict';

var sinon = require('sinon');

before(function() {
  var chai = require('chai');
  var sinonChai = require('sinon-chai');
  var chaiSubset = require('chai-subset');
  var chaiAsPromised = require('chai-as-promised');

  chai.use(chaiAsPromised);
  chai.use(chaiSubset);
  chai.use(sinonChai);
});


beforeEach(function() {
  this.sandbox = sinon.createSandbox();
});


afterEach(function() {
  this.sandbox.restore();
});
