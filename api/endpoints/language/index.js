'use strict';

var logger = require('logentries-logformat')('suite-sdk');

var Language = function(request) {
  this._request = request;
};

Language.prototype = {

  translate: function(customerId, language) {
    logger.log('language_translate');
    var languagePostfix = language ? '/' + language : '';
    return this._request.get(customerId, '/language/translate' + languagePostfix);
  }

};


Language.create = function(request) {
  return new Language(request);
};

module.exports = Language;
