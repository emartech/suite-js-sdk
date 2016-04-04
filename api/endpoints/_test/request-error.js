'use strict';

var expect = require('chai').expect;
var SuiteRequestError = require('escher-suiteapi-js').Error;

module.exports = {
  shouldThrowError: function(error) {

    var self = this;

    it('should throw the following error: "' + error.message + ' (' + error.code + ')"', function* () {
      var apiEndpoint = self.ApiEndpoint.create(self._getRequestStub(), { customerId: 123 });

      try {
        yield apiEndpoint[self.method](self.payload, self.options);
      } catch (ex) {
        expect(ex).to.be.an.instanceof(SuiteRequestError);
        expect(ex.message).to.eql(error.message);
        expect(ex.code).to.eql(error.code);
      }
    });
  }
};
