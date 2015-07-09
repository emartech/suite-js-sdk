var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('lodash');

module.exports = {
  shouldPutToEndpoint: function(expectedUrl, expectedPayload) {
    var _this = this;
    var apiEndpoint;
    var request;

    describe('towards ' + expectedUrl + ' endpoint', function() {
      beforeEach(function() {
        request = this._getRequestStub();
        apiEndpoint = this.ApiEndpoint.create(request, { customerId: 123 });
      }.bind(this));

      it('should properly call a PUT request', function* () {
        yield apiEndpoint[_this.method](_this.payload, _this.options);
        expect(request.put).to.have.been.callCount(1);
        expect(request.put).to.have.been.calledWith(123, expectedUrl, expectedPayload, {});
      });


      it('should return the result', function* () {
        var result = yield apiEndpoint[_this.method](_this.payload, _this.options);
        expect(request.put).to.have.been.callCount(1);
        expect(result).to.eql(_this._requestRespondWith);
      });


      it('should pass the options to the suite request', function* () {
        var options = _.merge({ customerId: 999, environment: 'otherEnv' }, _this.options);
        yield apiEndpoint[_this.method](_this.payload, options);
        expect(request.put).to.have.been.callCount(1);
        expect(request.put).to.have.been.calledWithExactly(sinon.match.any, sinon.match.any, sinon.match.any, options);
      });


      it('should override customerId from the options', function* () {
        yield apiEndpoint[_this.method](_this.payload, { customerId: 999 });
        expect(request.put).to.have.been.callCount(1);
        expect(request.put).to.have.been.calledWithExactly(999, sinon.match.any, sinon.match.any, { customerId: 999 });
      });
    }.bind(this));
  }
};
