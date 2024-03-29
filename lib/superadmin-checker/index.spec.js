'use strict';

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
        getAdministrator: sinon.stub()
      }
    };

    fakeSuiteApiWithoutCache = {
      administrator: {
        getAdministrator: sinon.stub()
      }
    };

    sinon.stub(SuiteApi, 'createWithCache')
      .withArgs(requestId)
      .returns(fakeSuiteApi);

    sinon.stub(SuiteApi, 'create').returns(fakeSuiteApiWithoutCache);
  });


  it('should returns with true if the admin is superadmin', async function() {
    getAdministratorRespondWith({ body: { data: { superadmin: 1 } } });

    var result = await Checker.isSuperadmin(adminIdentifierHash.customer_id, adminIdentifierHash.admin_id, requestId);
    expect(result).to.eql(true);
    expect(fakeSuiteApi.administrator.getAdministrator).calledWith(
      { administrator_id: adminIdentifierHash.admin_id },
      { customerId: adminIdentifierHash.customer_id });
  });


  it('should returns with false if the admin isnt superadmin', async function() {
    getAdministratorRespondWith({ body: { data: { superadmin: 0 } } });

    var result = await Checker.isSuperadmin(adminIdentifierHash.customer_id, adminIdentifierHash.admin_id, requestId);
    expect(result).to.eql(false);
    expect(fakeSuiteApi.administrator.getAdministrator).calledWith(
      { administrator_id: adminIdentifierHash.admin_id },
      { customerId: adminIdentifierHash.customer_id });
  });


  var getAdministratorRespondWith = function(responseHash) {
    fakeSuiteApi.administrator.getAdministrator.resolves(responseHash);
    fakeSuiteApiWithoutCache.administrator.getAdministrator.resolves(responseHash);
  };

});
