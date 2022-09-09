'use strict';

var SuiteRequestError = require('escher-suiteapi-js').Error;

module.exports = {
  shouldThrowError: function(error) {

    var self = this;

    it('should throw the following error: "' + error.message + ' (' + error.code + ')"', async function() {
      var apiEndpoint = self.ApiEndpoint.create(self._getRequestStub(), { customerId: 123 });

      try {
        await apiEndpoint[self.method](self.payload, self.options);
      } catch (ex) {
        expect(ex).to.be.an.instanceof(SuiteRequestError);
        expect(ex.message).to.eql(error.message);
        expect(ex.code).to.eql(error.code);
      }
    });
  }
};
