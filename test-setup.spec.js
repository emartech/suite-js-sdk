'use strict';

const chai = require('chai');
chai.use(require('chai-as-promised').default);
chai.use(require('sinon-chai').default);

global.expect = chai.expect;
global.sinon = require('sinon');

afterEach(function() {
  global.sinon.restore();
});
