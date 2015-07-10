var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('lodash');

module.exports = {
  shouldThrowError: function(error) {
    it('should throw the following error: "' + error.message + ' (' + error.code + ')"', function* () {
      var apiEndpoint = this.ApiEndpoint.create(this._getRequestStub(), { customerId: 123 });

      try {
        yield apiEndpoint[this.method](this.payload, this.options);
      } catch (ex) {
        expect(ex).to.eql(error);
        return;
      }

      throw new Error('Error not thrown!');
    }.bind(this));
  }
};
