var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('lodash');

module.exports = {
  shouldThrowError: function(error) {
    var _this = this;

    it('should throw the following error: "' + error.message + ' (' + error.code + ')"', function* () {
      var apiEndpoint = _this.ApiEndpoint.create(_this._getRequestStub(), { customerId: 123 });

      try {
        yield apiEndpoint[_this.method](_this.payload, _this.options);
      } catch(ex) {
        expect(ex).to.eql(error);
        return;
      }

      throw new Error('Error not thrown!');
    });
  }
};
