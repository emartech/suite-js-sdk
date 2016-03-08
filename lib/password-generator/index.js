'use strict';

var generatePassword = require('password-generator');

module.exports = {

  generate: function(length) {
    if (!length) {
      length = 16;
    }
    return generatePassword(length - 4, false, /[\d\W\w\p]/) + 3 + '!aA';
  }

};
