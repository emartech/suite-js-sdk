'use strict';

var expect = require('chai').expect;
var AdminList = require('./index.admin-list.js');

describe('AdminList', function() {

  var assertSuperadminFound = function(superadminToFind) {
    var foundSuperadmin = new AdminList([superadminToFind]).getFirstSuperadministrator();
    expect(foundSuperadmin).to.eql(superadminToFind);
  };


  describe('#getFirstSuperadministrator', function() {
    it('should find superadministrator by string superadmin flag', function() {
      assertSuperadminFound({ id: 1, superadmin: '1' });
    });


    it('should find superadministrator by int superadmin flag', function() {
      assertSuperadminFound({ id: 1, superadmin: 1 });
    });
  });
});
