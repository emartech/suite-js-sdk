'use strict';

var expect = require('chai').expect;
var SuiteApi = require('../../api');
var Checker = require('./');


describe('Admin checker', function() {

  var requestId;
  var fakeSuiteApi;
  var fakeSuiteApiWithoutCache;
  var adminIdentifierHash;

  beforeEach(function() {
    adminIdentifierHash = {
      customer_id: '12345',
      admin_id: '54321'
    };

    requestId = 5;

    fakeSuiteApi = {
      administrator: {
        getAdministrator: this.sandbox.stub()
      }
    };

    fakeSuiteApiWithoutCache = {
      administrator: {
        getAdministrator: this.sandbox.stub()
      }
    };

    this.sandbox.stub(SuiteApi, 'createWithCache')
      .withArgs(requestId)
      .returns(fakeSuiteApi);

    this.sandbox.stub(SuiteApi, 'create').returns(fakeSuiteApiWithoutCache);
  });


  it('should returns with true if the admin is superadmin', function* () {
    getAdministratorRespondWith({ superadmin: 1 });

    var result = yield Checker.isSuperadmin(adminIdentifierHash.customer_id, adminIdentifierHash.admin_id, requestId);
    expect(result).to.eql(true);
    expect(fakeSuiteApi.administrator.getAdministrator).calledWith(adminIdentifierHash.customer_id, adminIdentifierHash.admin_id);
  });


  it('should returns with false if the admin isnt superadmin', function* () {
    getAdministratorRespondWith({ superadmin: 0 });

    var result = yield Checker.isSuperadmin(adminIdentifierHash.customer_id, adminIdentifierHash.admin_id);
    expect(result).to.eql(false);
    expect(fakeSuiteApiWithoutCache.administrator.getAdministrator).calledWith(adminIdentifierHash.customer_id, adminIdentifierHash.admin_id);
  });


  var getAdministratorRespondWith = function(responseHash) {
    fakeSuiteApi.administrator.getAdministrator.returnsWithResolve(responseHash);
    fakeSuiteApiWithoutCache.administrator.getAdministrator.returnsWithResolve(responseHash);
  };

});
