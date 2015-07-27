'use strict';

var TranslateRenderDecorator = require('./render-decorator');


module.exports = {

  decorateRenderWithTranslations: function(translationId, apiOptions) {

    return function* DecorateRenderWithTranslationsMiddleware(next) {
      yield TranslateRenderDecorator.create(this, translationId, apiOptions).decorate();
      yield next;
    };

  }

};
