'use strict';

var _ = require('lodash');

module.exports = {
  shouldGetResultFromEndpoint: function(expectedUrl, expectedData) {
    var apiEndpoint;
    var request;


    expectedData = expectedData || this._requestRespondWith;

    describe('towards ' + expectedUrl + ' endpoint', function() {

      var self = this;

      beforeEach(function() {
        request = self._getRequestStub();
        apiEndpoint = self.ApiEndpoint.create(request, { customerId: 123 });
      });

      it('should properly call a GET request', async function() {
        await apiEndpoint[self.method](self.payload, self.options);
        expect(request.get).to.have.been.callCount(1);
        expect(request.get).to.have.been.calledWith(123, expectedUrl, {});
      });


      it('should return the result', async function() {
        var result = await apiEndpoint[self.method](self.payload, self.options);
        expect(request.get).to.have.been.callCount(1);
        expect(result).to.eql(expectedData);
      });


      it('should pass the options to the suite request', async function() {
        var options = _.merge({ customerId: 999, environment: 'otherEnv' }, self.options);
        await apiEndpoint[self.method](self.payload, options);
        expect(request.get).to.have.been.callCount(1);
        expect(request.get).to.have.been.calledWithExactly(sinon.match.any, sinon.match.any, options);
      });


      it('should override customerId from the options', async function() {
        await apiEndpoint[self.method](self.payload, { customerId: 999 });
        expect(request.get).to.have.been.callCount(1);
        expect(request.get).to.have.been.calledWithExactly(999, sinon.match.any, { customerId: 999 });
      });
    }.bind(this));
  }
};
