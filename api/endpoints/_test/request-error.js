'use strict';

const { EscherRequestError } = require('@emartech/escher-request');

module.exports = {
  shouldThrowError: function(error) {

    var self = this;

    it('should throw the following error: "' + error.message + ' (' + error.code + ')"', async function() {
      var apiEndpoint = self.ApiEndpoint.create(self._getRequestStub(), { customerId: 123 });

      try {
        await apiEndpoint[self.method](self.payload, self.options);
      } catch (ex) {
        expect(ex).to.be.an.instanceof(EscherRequestError);
        expect(ex.message).to.eql(error.message);
        expect(ex.code).to.eql(error.code);
      }
    });
  }
};
