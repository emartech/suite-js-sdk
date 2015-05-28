'use strict';

var flatten = require('flat');
var vsprintf = require('sprintf-js').vsprintf;

var Translator = function(dictionary) {
  this._dictionary = flatten(dictionary);
  this.translate = this.translate.bind(this);
};

Translator.prototype = {

  translate: function(key, params) {
    var value = this._dictionary[key];
    return (value) ? vsprintf(value, params) : key;
  }

};


Translator.create = function(dictionary) {
  return new Translator(dictionary);
};


Translator.getTranslationFunction = function(dictionary) {
  var translator = Translator.create(dictionary);
  return translator.translate;
};


module.exports = Translator;
