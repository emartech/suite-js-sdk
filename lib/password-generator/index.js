'use strict';

const crypto = require('crypto');

let _generateRandomString = function(length) {
  return crypto.randomBytes(length).reduce((password, nextByte) =>
    password += _byteToAsciiChar(nextByte)
  , '');
};

let _passwordIsValid = function(password) {
  let passwordValidators = [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]+/];

  return passwordValidators.filter((validator) => !password.match(validator)).length === 0;
};

let _byteToAsciiChar = function(val) {
  return String.fromCharCode(33 + Math.round(93 * val / 255));
};

module.exports = {
  generate: function(length) {
    let password;
    let passwordLength = length || 16;

    do {
      password = _generateRandomString(passwordLength);
    } while (!_passwordIsValid(password));

    return password;
  }
};
