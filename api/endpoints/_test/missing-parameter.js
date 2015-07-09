var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('lodash');

var APIRequiredParameterMissingError = require('./../_base/error');

module.exports = {
  shouldThrowMissingParameterError: function(missingParameters) {
    missingParameters = _.isArray(missingParameters) ? missingParameters : [missingParameters];
    var _this = this;

    describe('without ' + missingParameters.join() + ' parameter' + (missingParameters.length > 1 ? 's' : ''), function() {
      it('should throw a MissingParameterError', function* () {
        var apiEndpoint = _this.ApiEndpoint.create(_this._getRequestStub(), { customerId: 123 });

        try {
          yield apiEndpoint[_this.method](_this.payload, _this.options);
        } catch(ex) {
          expect(ex).to.be.an.instanceof(APIRequiredParameterMissingError);
          return;
        }

        throw new Error('Error not thrown!');
      });
    });
  }
};
