'use strict';

var TranslateRenderDecorator = require('./render-decorator');


module.exports = {

  decorateRenderWithTranslations: function(apiOptions) {

    return function* DecorateRenderWithTranslationsMiddleware(next) {
      yield TranslateRenderDecorator.create(this, apiOptions).decorate();
      yield next;
    };

  }

};
