var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('lodash');

module.exports = {
  shouldThrowError: function(error) {

    var self = this;

    it('should throw the following error: "' + error.message + ' (' + error.code + ')"', function* () {
      var apiEndpoint = self.ApiEndpoint.create(self._getRequestStub(), { customerId: 123 });

      try {
        yield apiEndpoint[self.method](self.payload, self.options);
      } catch (ex) {
        expect(ex).to.eql(error);
        return;
      }

      throw new Error('Error not thrown!');
    });
  }
};
