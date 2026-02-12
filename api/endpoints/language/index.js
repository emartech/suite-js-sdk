'use strict';

var util = require('util');
var _ = require('lodash');

const { createLogger } = require('@emartech/json-logger');
const logger = createLogger('suite-sdk');

var Base = require('../_base');

var Language = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(Language, Base);

_.extend(Language.prototype, {

  translate: function(payload, options) {
    logger.info('language_translate');

    var languagePostfix = payload.language ? '/' + payload.language : '';

    return this._request.get(
      this._getCustomerId(options),
      util.format('/language/translate%s', languagePostfix),
      options
    );
  }

});

Language.create = function(request, options) {
  return new Language(request, options);
};

module.exports = Language;
