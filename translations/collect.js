'use strict';

var SuiteAPI = require('../api');
var request = require('co-request');
var logger = require('logentries-logformat')('collect-translations');
var APIRequiredParameterMissingError = require('../api/endpoints/_base/error');

var translationCache = {};



var CollectTranslations = function(environment, translationId, cacheId) {

  if (!translationId) {
    throw new APIRequiredParameterMissingError('translationId');
  }

  this._api = SuiteAPI.createWithCache(cacheId);
  this._environment = environment;
  this._translationId = translationId;
};


CollectTranslations.prototype = {

  execute: function* (adminId, options) {
    var response = yield this._api.administrator.getAdministrator({ administrator_id: adminId }, options);
    var admin = response.body.data;

    logger.log('admin fetched', adminId);
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


CollectTranslations.getFor = function(environment, translationId, cacheId) {
  return new CollectTranslations(environment, translationId, cacheId);
};


module.exports = CollectTranslations;
