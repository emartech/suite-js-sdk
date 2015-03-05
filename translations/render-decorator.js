'use strict';

var _ = require('lodash');
var CollectTranslations = require('./collect');
var Translator = require('./translator');

var RenderDecorator = function(context) {
  this._context = context;
  this._validatedData = context.request.validatedData || context.validatedData;
  this._translations = null;
  this._originalRender = this._context.render;
};


RenderDecorator.prototype = {

  decorate: function* () {
    this._checkValidatedData();
    yield this._loadTranslations();

    this._context.render = this._render.bind(this);
  },


  _checkValidatedData: function() {
    if (!this._validatedData) {
      throw new Error('decorateRenderWithTranslations middleware need validatedData from request\'s');
    }

    if (!this._validatedData.environment) {
      throw new Error('decorateRenderWithTranslations middleware need environment from request\'s validatedData');
    }
  },


  _loadTranslations: function* () {
    var collectTranslations = CollectTranslations.getFor(this._validatedData.environment, this._context.id);

    if (this._validatedData.customer_id && this._validatedData.admin_id) {
      this._translations = yield collectTranslations.execute(this._validatedData.customer_id, this._validatedData.admin_id);
    } else {
      var language = (this._validatedData.language) ? this._validatedData.language : 'en';
      this._translations = yield collectTranslations.getSuiteTranslations(language);
    }
  },


  _render: function* renderWithTranslations(path, data) {
    data = _.extend({}, data, {
      translations: this._translations,
      _: Translator.getTranslationFunction(this._translations)
    });

    yield this._originalRender.call(this._context, path, data);
  }};


RenderDecorator.create = function(context) { return new RenderDecorator(context) };


module.exports = RenderDecorator;