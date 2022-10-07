'use strict';

var TranslateRenderDecorator = require('./render-decorator');

module.exports = {
  decorateRenderWithTranslations: function(translationId, apiOptions) {
    return async function DecorateRenderWithTranslationsMiddleware(next) {
      await TranslateRenderDecorator.create(
        this,
        translationId,
        apiOptions
      ).decorate();

      const result = await next();

      if (next.constructor.name === 'GeneratorFunction') {
        result.next();
      }
    };
  }
};
