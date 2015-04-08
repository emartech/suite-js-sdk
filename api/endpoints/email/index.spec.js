'use strict';

var expect = require('chai').expect;
var EmailAPI = require('./');

describe('Suite Email', function() {

  it('copies an existing email', function () {

    var api = EmailAPI.create({
      post: function (customerId, url, payload) {
        expect(url).to.equal('/email/32/copy');
        expect(payload).to.eql({
          name: '3'
        });
      }
    });

    api.copy(0, 32, {
      name: '3'
    });

  });

});
