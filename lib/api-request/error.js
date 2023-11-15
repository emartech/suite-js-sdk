'use strict';

class SuiteRequestError extends Error {
  constructor(message, code, response, originalCode) {
    super(message);

    this.code = code;
    this.originalCode = originalCode;
    this.name = 'SuiteRequestError';

    if (response) {
      this.data = response.data || response;
    } else {
      this.data = {
        replyText: message
      };
    }
  }

  static createFromEscherRequestError(error) {
    return new SuiteRequestError(error.message, error.code, { data: error.data }, error.originalCode);
  }
}

module.exports = SuiteRequestError;
