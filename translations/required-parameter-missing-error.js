'use strict';

var TranslationRequiredParameterMissingError = function(requiredParameter) {
  this.name = 'TranslationRequiredParameterMissingError';
  this.requiredParameter = requiredParameter;
  this.message = 'Required parameters missing: ' + requiredParameter;
  this.stack = new Error().stack;
};

TranslationRequiredParameterMissingError.prototype = Object.create(Error.prototype);


module.exports = TranslationRequiredParameterMissingError;
