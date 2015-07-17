var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('lodash');

var APIRequiredParameterMissingError = require('./../_base/error');

module.exports = {
  shouldThrowMissingParameterError: function(missingParameters) {
    missingParameters = _.isArray(missingParameters) ? missingParameters : [missingParameters];
    describe('without ' + missingParameters.join() + ' parameter' + (missingParameters.length > 1 ? 's' : ''), function() {

      var self = this;

      it('should throw a MissingParameterError', function* () {
        var apiEndpoint = self.ApiEndpoint.create(self._getRequestStub(), { customerId: 123 });

        try {
          yield apiEndpoint[self.method](self.payload, self.options);
        } catch (ex) {
          expect(ex).to.be.an.instanceof(APIRequiredParameterMissingError);
          return;
        }

        throw new Error('Error not thrown!');
      });
    }.bind(this));
  }
};
