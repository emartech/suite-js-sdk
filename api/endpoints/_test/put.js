'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('lodash');

module.exports = {
  shouldPutToEndpoint: function(expectedUrl, expectedPayload) {
    var apiEndpoint;
    var request;

    describe('towards ' + expectedUrl + ' endpoint', function() {

      var self = this;

      beforeEach(function() {
        request = self._getRequestStub();
        apiEndpoint = self.ApiEndpoint.create(request, { customerId: 123 });
      });

      it('should properly call a PUT request', function* () {
        yield apiEndpoint[self.method](self.payload, self.options);
        expect(request.put).to.have.been.callCount(1);
        expect(request.put).to.have.been.calledWith(123, expectedUrl, expectedPayload, {});
      });


      it('should return the result', function* () {
        var result = yield apiEndpoint[self.method](self.payload, self.options);
        expect(request.put).to.have.been.callCount(1);
        expect(result).to.eql(self._requestRespondWith);
      });


      it('should pass the options to the suite request', function* () {
        var options = _.merge({ customerId: 999, environment: 'otherEnv' }, self.options);
        yield apiEndpoint[self.method](self.payload, options);
        expect(request.put).to.have.been.callCount(1);
        expect(request.put).to.have.been.calledWithExactly(sinon.match.any, sinon.match.any, sinon.match.any, options);
      });


      it('should override customerId from the options', function* () {
        yield apiEndpoint[self.method](self.payload, { customerId: 999 });
        expect(request.put).to.have.been.callCount(1);
        expect(request.put).to.have.been.calledWithExactly(999, sinon.match.any, sinon.match.any, { customerId: 999 });
      });
    }.bind(this));
  }
};
