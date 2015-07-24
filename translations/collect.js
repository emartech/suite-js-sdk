'use strict';

var SuiteAPI = require('../api');
var request = require('co-request');
var logger = require('logentries-logformat')('collect-translations');
var APIRequiredParameterMissingError = require('../api/endpoints/_base/error');

var translationCache = {};



var CollectTranslations = function(environment, translationId, cacheId, apiOptions) {

  if (!translationId) {
    throw new APIRequiredParameterMissingError('translationId');
  }

  this._api = SuiteAPI.createWithCache(cacheId, apiOptions);
  this._environment = environment;
  this._translationId = translationId;
};


CollectTranslations.prototype = {

  execute: function* (customerId, adminId) {
    var response = yield this._api.administrator.getAdministrator({ administrator_id: adminId }, { customerId: customerId });
    var admin = response.body.data;

    return yield this.getSuiteTranslations(admin.interface_language);
  },


  getSuiteTranslations: function* (language) {
    if (!translationCache[language]) {
      yield this._collectTranslationFromSuite(language);
    }

    return translationCache[language];
  },


  _collectTranslationFromSuite: function* (language) {
    var data = yield request('http://' + this._environment + '/js/translate/translate_' + this._translationId + '.js.php?lang=' + language);
    data = (data && data.body) ? JSON.parse(data.body) : {};

    translationCache[language] = data;
    logger.log('collected', language);
  }

};


CollectTranslations.clearCache = function() {
  translationCache = {};
};


CollectTranslations.getFor = function(environment, cacheId, options) {
  return new CollectTranslations(environment, cacheId, options);
};


module.exports = CollectTranslations;
