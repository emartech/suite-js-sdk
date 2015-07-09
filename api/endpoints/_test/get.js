var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('lodash');

module.exports = {
  shouldGetResultFromEndpoint: function(expectedUrl, expectedData) {
    var _this = this;
    var apiEndpoint;
    var request;

    expectedData = expectedData || this._requestRespondWith;

    describe('towards ' + expectedUrl + ' endpoint', function() {
      beforeEach(function() {
        request = this._getRequestStub();
        apiEndpoint = this.ApiEndpoint.create(request, { customerId: 123 });
      }.bind(this));

      it('should properly call a GET request', function* () {
        yield apiEndpoint[_this.method](_this.payload, _this.options);
        expect(request.get).to.have.been.callCount(1);
        expect(request.get).to.have.been.calledWith(123, expectedUrl, {});
      });


      it('should return the result', function* () {
        var result = yield apiEndpoint[_this.method](_this.payload, _this.options);
        expect(request.get).to.have.been.callCount(1);
        expect(result).to.eql(expectedData);
      });


      it('should pass the options to the suite request', function* () {
        var options = _.merge({ customerId: 999, environment: 'otherEnv' }, _this.options);
        yield apiEndpoint[_this.method](_this.payload, options);
        expect(request.get).to.have.been.callCount(1);
        expect(request.get).to.have.been.calledWithExactly(sinon.match.any, sinon.match.any, options);
      });


      it('should override customerId from the options', function* () {
        yield apiEndpoint[_this.method](_this.payload, { customerId: 999 });
        expect(request.get).to.have.been.callCount(1);
        expect(request.get).to.have.been.calledWithExactly(999, sinon.match.any, { customerId: 999 });
      });
    }.bind(this));
  }
};
