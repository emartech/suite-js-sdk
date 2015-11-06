'use strict';

var _ = require('lodash');
var sinon = require('sinon');

var FakeContext = function() {
  this._renderArgs = [];
  this.id = 'some-request-id';
  this.throw = sinon.spy();
  this.request = {
    ip: '127.0.0.1',
    body: {},
    query: {},
    method: '',
    url: '',
    header: {
      host: ''
    },
    headers: {
      'x-forwarded-for': ''
    }
  };
  this.validatedData = {};
};


FakeContext.prototype = {

  render: function() {
    this._renderArgs.push(arguments);
  },


  getLastRenderArgs: function() {
    return _.last(this._renderArgs);
  },


  getLastRenderData: function() {
    return this.getLastRenderArgs()[1];
  },


  setValidatedData: function(validatedData) {
    this.request.validatedData = validatedData;
  }

};

FakeContext.create = function() {
  return new FakeContext(arguments);
};

module.exports.FakeContext = FakeContext;

module.exports.FakeTranslationRenderDecorator = { decorate: function* () {} };
