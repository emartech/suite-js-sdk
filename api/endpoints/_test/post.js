'use strict';

var _ = require('lodash');

module.exports = {
  shouldPostToEndpoint: function(expectedUrl, expectedPayload) {
    var apiEndpoint;
    var request;

    describe('towards ' + expectedUrl + ' endpoint', function() {

      var self = this;

      beforeEach(function() {
        request = self._getRequestStub();
        apiEndpoint = self.ApiEndpoint.create(request, { customerId: 123 });
      });

      it('should properly call a POST request', async function() {
        await apiEndpoint[self.method](self.payload, self.options);
        expect(request.post).to.have.been.callCount(1);
        expect(request.post).to.have.been.calledWith(123, expectedUrl, expectedPayload, sinon.match.any);
      });


      it('should return the result', async function() {
        var result = await apiEndpoint[self.method](self.payload, self.options);
        expect(request.post).to.have.been.callCount(1);
        expect(result).to.eql(self._requestRespondWith);
      });


      it('should pass the options to the suite request', async function() {
        var options = _.merge({ customerId: 999, environment: 'otherEnv' }, self.options);
        await apiEndpoint[self.method](self.payload, options);
        expect(request.post).to.have.been.callCount(1);
        expect(request.post).to.have.been.calledWithExactly(sinon.match.any, sinon.match.any, sinon.match.any, options);
      });


      it('should override customerId from the options', async function() {
        await apiEndpoint[self.method](self.payload, { customerId: 999 });
        expect(request.post).to.have.been.callCount(1);
        expect(request.post).to.have.been.calledWithExactly(999, sinon.match.any, sinon.match.any, { customerId: 999 });
      });
    }.bind(this));
  }
};
