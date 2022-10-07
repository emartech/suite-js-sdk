'use strict';

var sinon = require('sinon');
var AdministratorAPI = require('./');
var PasswordGenerator = require('../../../lib/password-generator');
var DateHelper = require('../../../lib/date-helper');
var testApiMethod = require('../_test');
var SuiteRequestError = require('escher-suiteapi-js').Error;

describe('SuiteAPI Administrator endpoint', function() {
  const ADMINISTRATOR_ID = 12;

  describe('#getAdministrators', function() {
    testApiMethod(AdministratorAPI, 'getAdministrators').shouldGetResultFromEndpoint('/administrator');
  });


  describe('#getInterfaceLanguages', function() {
    testApiMethod(AdministratorAPI, 'getInterfaceLanguages').shouldGetResultFromEndpoint('/administrator/getinterfacelanguages');
  });


  describe('#getStartPages', function() {
    testApiMethod(AdministratorAPI, 'getStartPages')
      .shouldGetResultFromEndpoint('/administrator/getstartpages');
  });


  describe('#getRestrictedStartPages', function() {
    testApiMethod(AdministratorAPI, 'getRestrictedStartPages').withArgs({
      administrator_id: ADMINISTRATOR_ID
    }).shouldGetResultFromEndpoint(`/administrator/${ADMINISTRATOR_ID}/getstartpages`);
  });


  describe('#getAccessLevels', function() {
    testApiMethod(AdministratorAPI, 'getAccessLevels').shouldGetResultFromEndpoint('/administrator/getaccesslevels');
  });


  describe('#patchAdministrator', function() {
    testApiMethod(AdministratorAPI, 'patchAdministrator').withArgs({
      administrator_id: ADMINISTRATOR_ID,
      data: 'someData'
    }).shouldPostToEndpoint(`/administrator/${ADMINISTRATOR_ID}/patch`, {
      data: 'someData'
    });

    testApiMethod(AdministratorAPI, 'patchAdministrator').shouldThrowMissingParameterError('administrator_id');
  });


  describe('#getAdministrator', function() {
    const administratorId = '3';

    testApiMethod(AdministratorAPI, 'getAdministrator').withArgs({
      administrator_id: administratorId
    })
      .requestResponseWith({
        body: {
          data: { id: administratorId, superadmin: '0' }
        }
      }).shouldGetResultFromEndpoint(`/administrator/${administratorId}`, {
        body: { data: { id: administratorId, superadmin: '0' } }
      });

    testApiMethod(AdministratorAPI, 'getAdministrator').shouldThrowMissingParameterError('administrator_id');
  });


  describe('#getAdministratorByName', function() {
    testApiMethod(AdministratorAPI, 'getAdministratorByName').withArgs({
      admin_name: 'adminName'
    })
      .requestResponseWith({
        body: {
          data: [
            { id: '1', username: 'adminName', email: 'kalman@email.com' },
            { id: '2', username: 'adminName2', email: 'kalman2@email.com' }
          ]
        }
      }).shouldGetResultFromEndpoint('/administrator', {
        body: { data: { id: '1', username: 'adminName', email: 'kalman@email.com' } }
      });

    testApiMethod(AdministratorAPI, 'getAdministratorByName').shouldThrowMissingParameterError('admin_name');


    describe('requesting admin who not exists', function() {
      testApiMethod(AdministratorAPI, 'getAdministratorByName').withArgs({
        admin_name: 'notExists'
      })
        .requestResponseWith({
          body: {
            data: [
              { id: '1', username: 'adminName', email: 'kalman@email.com' },
              { id: '2', username: 'adminName2', email: 'kalman2@email.com' }
            ]
          }
        }).shouldThrowError(new SuiteRequestError('There is no admin for this customer', 400));
    });
  });


  describe('#getSuperadmins', function() {
    testApiMethod(AdministratorAPI, 'getSuperadmins')
      .requestResponseWith({
        body: {
          data: [
            { id: '1', username: 'adminName', email: 'kalman@email.com', superadmin: '0' },
            { id: '2', username: 'adminName2', email: 'kalman2@email.com', superadmin: '1' },
            { id: '3', username: 'adminName3', email: 'kalman3@email.com', superadmin: '1' }
          ]
        }
      }).shouldGetResultFromEndpoint('/administrator', {
        body: {
          data: [
            { id: '2', username: 'adminName2', email: 'kalman2@email.com', superadmin: '1' },
            { id: '3', username: 'adminName3', email: 'kalman3@email.com', superadmin: '1' }
          ]
        }
      });


    describe('requesting admin who not exists', function() {
      testApiMethod(AdministratorAPI, 'getSuperadmins')
        .requestResponseWith({
          body: {
            data: [
              { id: '1', username: 'adminName', email: 'kalman@email.com', superadmin: '0' },
              { id: '2', username: 'adminName2', email: 'kalman2@email.com', superadmin: '0' }
            ]
          }
        }).shouldThrowError(new SuiteRequestError('There is no admin for this customer', 400));
    });
  });


  describe('#createAdministrator', function() {
    describe('forcing disabled to 1', function() {
      testApiMethod(AdministratorAPI, 'createAdministrator')
        .shouldPostToEndpoint('/administrator', sinon.match({
          disabled: 1
        }));

      testApiMethod(AdministratorAPI, 'createAdministrator')
        .withArgs({
          disabled: 0
        })
        .shouldPostToEndpoint('/administrator', sinon.match({
          disabled: 1
        }));
    });


    describe('with additional data', function() {
      testApiMethod(AdministratorAPI, 'createAdministrator')
        .withArgs({
          first_name: 'FirstName'
        })
        .shouldPostToEndpoint('/administrator', sinon.match({
          first_name: 'FirstName',
          disabled: 1
        }));
    });


    describe('adding default values', function() {
      beforeEach(function() {
        sinon.stub(PasswordGenerator, 'generate').returns('test!!!Password');
        sinon.stub(DateHelper, 'getCurrentDate').returns('1999-01-01 01:01');
      });

      testApiMethod(AdministratorAPI, 'createAdministrator')
        .shouldPostToEndpoint('/administrator', sinon.match({
          access_level: 0,
          interface_language: 'en',
          superadmin: 0,
          disabled: 1,
          password: 'test!!!Password',
          last_invitation_action_date: '1999-01-01 01:01'
        }));
    });
  });


  describe('#inviteExistingAdministrator', function() {
    describe('force data for invitation', function() {
      beforeEach(function() {
        sinon.stub(DateHelper, 'getCurrentDate').returns('1999-01-01 01:01');
      });

      testApiMethod(AdministratorAPI, 'inviteExistingAdministrator')
        .withArgs({
          administrator_id: 21,
          first_name: 'FirstName'
        })
        .shouldPostToEndpoint('/administrator/21/patch', sinon.match({
          last_invitation_action_date: '1999-01-01 01:01',
          first_name: 'FirstName'
        }));
    });

    describe('with additional data', function() {
      testApiMethod(AdministratorAPI, 'inviteExistingAdministrator')
        .withArgs({
          administrator_id: 21,
          first_name: 'FirstName'
        })
        .shouldPostToEndpoint('/administrator/21/patch', sinon.match({
          first_name: 'FirstName'
        }));
    });

    testApiMethod(AdministratorAPI, 'inviteExistingAdministrator').shouldThrowMissingParameterError('administrator_id');
  });


  describe('#createSuperadmin', function() {
    describe('forcing superadmin and disabled to 1', function() {
      testApiMethod(AdministratorAPI, 'createSuperadmin')
        .shouldPostToEndpoint('/administrator', sinon.match({
          disabled: 1,
          superadmin: 1
        }));

      testApiMethod(AdministratorAPI, 'createSuperadmin')
        .withArgs({
          disabled: 0,
          superadmin: 0
        })
        .shouldPostToEndpoint('/administrator', sinon.match({
          disabled: 1,
          superadmin: 1
        }));
    });


    describe('with additional data', function() {
      testApiMethod(AdministratorAPI, 'createSuperadmin')
        .withArgs({
          first_name: 'FirstName'
        })
        .shouldPostToEndpoint('/administrator', sinon.match({
          first_name: 'FirstName',
          disabled: 1,
          superadmin: 1
        }));
    });


    describe('adding default values', function() {
      beforeEach(function() {
        sinon.stub(PasswordGenerator, 'generate').returns('test!!!Password');
        sinon.stub(DateHelper, 'getCurrentDate').returns('1999-01-01 01:01');
      });

      testApiMethod(AdministratorAPI, 'createSuperadmin')
        .shouldPostToEndpoint('/administrator', sinon.match({
          access_level: 0,
          interface_language: 'en',
          superadmin: 1,
          disabled: 1,
          password: 'test!!!Password',
          last_invitation_action_date: '1999-01-01 01:01'
        }));
    });
  });


  describe('#promoteToSuperadmin', function() {
    describe('should not modify the access level', function() {
      beforeEach(function() {
        sinon.stub(DateHelper, 'getCurrentDate').returns('1999-01-01 01:01');
      });

      testApiMethod(AdministratorAPI, 'promoteToSuperadmin')
        .withArgs({
          administrator_id: 21,
          first_name: 'FirstName'
        })
        .shouldPostToEndpoint('/administrator/21/patch', sinon.match({
          last_invitation_action_date: '1999-01-01 01:01',
          first_name: 'FirstName',
          superadmin: 1
        }));

      testApiMethod(AdministratorAPI, 'promoteToSuperadmin')
        .withArgs({
          administrator_id: 21,
          password: 'otherpassword',
          last_invitation_action_date: '1979-09-09 09:09',
          superadmin: 0,
          access_level: 1
        })
        .shouldPostToEndpoint('/administrator/21/patch', sinon.match({
          password: 'otherpassword',
          last_invitation_action_date: '1999-01-01 01:01',
          superadmin: 1,
          access_level: 1
        }));
    });

    describe('with additional data', function() {
      testApiMethod(AdministratorAPI, 'promoteToSuperadmin')
        .withArgs({
          administrator_id: 21,
          first_name: 'FirstName'
        })
        .shouldPostToEndpoint('/administrator/21/patch', sinon.match({
          first_name: 'FirstName'
        }));
    });

    testApiMethod(AdministratorAPI, 'promoteToSuperadmin').shouldThrowMissingParameterError('administrator_id');
  });


  describe('#enableAdministrator', function() {
    testApiMethod(AdministratorAPI, 'enableAdministrator').withArgs({
      administrator_id: ADMINISTRATOR_ID,
      data: 'someData'
    }).shouldPostToEndpoint(`/administrator/${ADMINISTRATOR_ID}/patch`, sinon.match({
      data: 'someData'
    }));

    testApiMethod(AdministratorAPI, 'enableAdministrator').shouldThrowMissingParameterError('administrator_id');


    describe('force data for invitation', function() {
      beforeEach(function() {
        sinon.stub(DateHelper, 'getCurrentDate').returns('1999-01-01 01:01');
      });

      testApiMethod(AdministratorAPI, 'enableAdministrator')
        .withArgs({
          administrator_id: 21,
          first_name: 'FirstName'
        })
        .shouldPostToEndpoint('/administrator/21/patch', sinon.match({
          first_name: 'FirstName',
          disabled: 0,
          last_verification_action_date: '1999-01-01 01:01'
        }));

      testApiMethod(AdministratorAPI, 'enableAdministrator')
        .withArgs({
          administrator_id: 21,
          last_verification_action_date: '1979-09-09 09:09',
          disabled: 1
        })
        .shouldPostToEndpoint('/administrator/21/patch', sinon.match({
          disabled: 0,
          last_verification_action_date: '1999-01-01 01:01'
        }));
    });
  });


  describe('#disableAdministrator', function() {
    testApiMethod(AdministratorAPI, 'disableAdministrator').withArgs({
      administrator_id: ADMINISTRATOR_ID,
      data: 'someData'
    }).shouldPostToEndpoint(`/administrator/${ADMINISTRATOR_ID}/patch`, sinon.match({
      data: 'someData'
    }));

    testApiMethod(AdministratorAPI, 'disableAdministrator').shouldThrowMissingParameterError('administrator_id');


    describe('force data for invitation', function() {
      beforeEach(function() {
        sinon.stub(DateHelper, 'getCurrentDate').returns('1999-01-01 01:01');
      });

      testApiMethod(AdministratorAPI, 'disableAdministrator')
        .withArgs({
          administrator_id: 21,
          first_name: 'FirstName'
        })
        .shouldPostToEndpoint('/administrator/21/patch', sinon.match({
          first_name: 'FirstName',
          disabled: 1
        }));

      testApiMethod(AdministratorAPI, 'disableAdministrator')
        .withArgs({
          administrator_id: 21,
          disabled: 0
        })
        .shouldPostToEndpoint('/administrator/21/patch', sinon.match({
          disabled: 1
        }));
    });
  });


  describe('#deleteAdministrator', function() {
    testApiMethod(AdministratorAPI, 'deleteAdministrator').withArgs({
      administrator_id: ADMINISTRATOR_ID,
      successor_administrator_id: 55,
      data: 'someData'
    }).shouldPostToEndpoint(`/administrator/${ADMINISTRATOR_ID}/delete`, {
      data: 'someData',
      successor_administrator_id: 55
    });

    testApiMethod(AdministratorAPI, 'deleteAdministrator').shouldThrowMissingParameterError('administrator_id');
    testApiMethod(AdministratorAPI, 'deleteAdministrator').shouldThrowMissingParameterError('successor_administrator_id');
  });
});
