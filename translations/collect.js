'use strict';

var SuiteAPI = require('../api');
var request = require('co-request');
var logger = require('logentries-logformat')('collect-translations');

var translationCache = {};


var CollectTranslations = function(environment, cacheId) {
  this._api = SuiteAPI.createWithCache(cacheId);
  this._environment = environment;
};


CollectTranslations.prototype = {

  execute: function* (customerId, adminId) {
    var administrator = yield this._api.administrator.getAdministrator(customerId, adminId);
    return yield this.getSuiteTranslations(administrator.interface_language);
  },


  getSuiteTranslations: function* (language) {
    if (!translationCache[language]) {
      yield this._collectTranslationFromSuite(language);
    }

    return translationCache[language];
  },


  _collectTranslationFromSuite: function* (language) {
    var data = yield request('http://' + this._environment + '/js/translate/translate_um.js.php?lang=' + language);
    data = (data && data.body) ? JSON.parse(data.body) : {};

    translationCache[language] = data;
    logger.log('collected', language);
  }

};


CollectTranslations.clearCache = function() {
  translationCache = {};
};


CollectTranslations.getFor = function(environment, cacheId) {
  return new CollectTranslations(environment, cacheId);
};


module.exports = CollectTranslations;