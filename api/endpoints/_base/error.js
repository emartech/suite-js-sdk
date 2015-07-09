'use strict';

function APIRequiredParameterMissingError(requiredParameter) {
  this.name = 'APIRequiredParameterMissingError';
  this.requiredParameter = requiredParameter;
  this.message = 'Required parameters missing: ' + requiredParameter;
  this.stack = new Error().stack;
}

APIRequiredParameterMissingError.prototype = Object.create(Error.prototype);


module.exports = APIRequiredParameterMissingError;
