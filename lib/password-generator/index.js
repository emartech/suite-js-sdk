'use strict';

var generatePassword = require('password-generator');

module.exports = {

  generate: function(length) {
    if (!length) {
      length = 16;
    }
    return generatePassword(length - 3, false) + 3 + 'aA';
  }

};
