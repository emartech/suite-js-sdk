'use strict';

var TranslateRenderDecorator = require('./render-decorator');


module.exports = {

  decorateRenderWithTranslations: function () {

    return function* DecorateRenderWithTranslationsMiddleware(next) {
      yield TranslateRenderDecorator.create(this).decorate();
      yield next;
    }

  }

};
