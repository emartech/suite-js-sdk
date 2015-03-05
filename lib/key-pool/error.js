'use strict';

function KeyPoolError(code, message) {
  this.name = 'KeyPoolError';
  this.code = code;
  this.message = message;
}

KeyPoolError.prototype = new Error();


module.exports = KeyPoolError;