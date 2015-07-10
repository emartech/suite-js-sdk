var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('lodash');

module.exports = {
  shouldGetResultFromEndpoint: function(expectedUrl, expectedData) {
    var apiEndpoint;
    var request;

    expectedData = expectedData || this._requestRespondWith;

    describe('towards ' + expectedUrl + ' endpoint', function() {
      beforeEach(function() {
        request = this._getRequestStub();
        apiEndpoint = this.ApiEndpoint.create(request, { customerId: 123 });
      }.bind(this));

      it('should properly call a GET request', function* () {
        yield apiEndpoint[this.method](this.payload, this.options);
        expect(request.get).to.have.been.callCount(1);
        expect(request.get).to.have.been.calledWith(123, expectedUrl, {});
      }.bind(this));


      it('should return the result', function* () {
        var result = yield apiEndpoint[this.method](this.payload, this.options);
        expect(request.get).to.have.been.callCount(1);
        expect(result).to.eql(expectedData);
      }.bind(this));


      it('should pass the options to the suite request', function* () {
        var options = _.merge({ customerId: 999, environment: 'otherEnv' }, this.options);
        yield apiEndpoint[this.method](this.payload, options);
        expect(request.get).to.have.been.callCount(1);
        expect(request.get).to.have.been.calledWithExactly(sinon.match.any, sinon.match.any, options);
      }.bind(this));


      it('should override customerId from the options', function* () {
        yield apiEndpoint[this.method](this.payload, { customerId: 999 });
        expect(request.get).to.have.been.callCount(1);
        expect(request.get).to.have.been.calledWithExactly(999, sinon.match.any, { customerId: 999 });
      }.bind(this));
    }.bind(this));
  }
};
