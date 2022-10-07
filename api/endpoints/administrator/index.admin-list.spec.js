'use strict';

var AdminList = require('./index.admin-list.js');

describe('AdminList', function() {

  describe('#getSuperadministrators', function() {
    it('should return all the superadministrators', function() {
      var administrators = [
        { id: 1, superadmin: 0 },
        { id: 2, superadmin: 1 },
        { id: 3, superadmin: '1' }
      ];

      var foundSuperadmins = new AdminList(administrators).getSuperadministrators();
      expect(foundSuperadmins).to.eql([
        { id: 2, superadmin: 1 },
        { id: 3, superadmin: '1' }
      ]);
    });
  });

});
