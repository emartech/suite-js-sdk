'use strict';

var SuiteAPI = require('../api');
var axios = require('axios');

const { createLogger } = require('@emartech/json-logger');
const logger = createLogger('suite-sdk');

var TranslationRequiredParameterMissingError = require('./required-parameter-missing-error');

var translationCache = {};

var CollectTranslations = function(environment, translationId, cacheId) {
  if (!translationId) {
    throw new TranslationRequiredParameterMissingError('translationId');
  }

  this._api = SuiteAPI.createWithCache(cacheId);
  this._environment = environment;
  this._translationId = translationId;
};

CollectTranslations.prototype = {
  execute: async function(adminId, options) {
    var response = await this._api.administrator.getAdministrator(
      { administrator_id: adminId },
      options
    );
    var admin = response.body.data;

    logger.info('admin fetched', adminId);
    return await this.getSuiteTranslations(admin.interface_language);
  },

  getSuiteTranslations: async function(language) {
    if (!translationCache[language]) {
      await this._collectTranslationFromSuite(language);
    }

    return translationCache[language];
  },

  _collectTranslationFromSuite: async function(language) {
    const response = await axios.get(this._getTranslationUrl(language));
    const translation = response && response.data ? response.data : {};

    translationCache[language] = translation;
    logger.info('collected', language);
  },

  _getTranslationUrl: function(language) {
    var filename =
      this._translationId === CollectTranslations.COMMON_TRANSLATIONS_ID ?
        'translation.js.php' :
        'translate_' + this._translationId + '.js.php';

    return (
      'https://' +
      this._environment +
      '/js/translate/' +
      filename +
      '?lang=' +
      language
    );
  }
};

CollectTranslations.clearCache = function() {
  translationCache = {};
};

CollectTranslations.getFor = function(environment, translationId, cacheId) {
  return new CollectTranslations(environment, translationId, cacheId);
};

CollectTranslations.COMMON_TRANSLATIONS_ID = 'load_common_translations';

module.exports = CollectTranslations;
