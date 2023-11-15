'use strict';

const { EscherRequestError } = require('@emartech/escher-request');
const SuiteRequestError = require('./error');

describe('SuiteRequestError', function() {
  describe('constructor', function() {
    it('should extend base Error class', function() {
      const error = new SuiteRequestError();

      expect(error).to.be.an.instanceOf(Error);
    });

    it('should store constructor parameters', function() {
      const error = new SuiteRequestError('Invalid request', 400, {
        data: {
          replyText: 'Too long',
          detailedMessage: 'Line too long'
        }
      }, 'ECONNABORTED');

      expect(error.message).to.eql('Invalid request');
      expect(error.code).to.eql(400);
      expect(error.data).to.eql({
        replyText: 'Too long',
        detailedMessage: 'Line too long'
      });
      expect(error.originalCode).to.eql('ECONNABORTED');
    });

    it('should store response as is when no data attribute present', function() {
      const error = new SuiteRequestError('Invalid request', 400, {
        replyText: 'Too long',
        detailedMessage: 'Line too long'
      });

      expect(error.message).to.eql('Invalid request');
      expect(error.code).to.eql(400);
      expect(error.data).to.eql({
        replyText: 'Too long',
        detailedMessage: 'Line too long'
      });
    });

    it('should always contain data on error', function() {
      const error = new SuiteRequestError('Unauthorized');

      expect(error.data).to.eql({ replyText: 'Unauthorized' });
    });
  });

  describe('createFromEscherRequestError', function() {
    it('should map message, code and originalCode properties', function() {
      const escherRequestError = new EscherRequestError('Unauthorized', 499, '', 'ECONNABORTED');
      const error = SuiteRequestError.createFromEscherRequestError(escherRequestError);

      expect(error.message).to.eql('Unauthorized');
      expect(error.code).to.eql(499);
      expect(error.originalCode).to.eql('ECONNABORTED');
    });

    it('should map default data', function() {
      const escherRequestError = new EscherRequestError('Unauthorized', 0);
      const error = SuiteRequestError.createFromEscherRequestError(escherRequestError);

      expect(error.data).to.eql({ replyText: 'Unauthorized' });
    });

    it('should map text data', function() {
      const escherRequestError = new EscherRequestError('', 0, 'response text');
      const error = SuiteRequestError.createFromEscherRequestError(escherRequestError);

      expect(error.data).to.eql('response text');
    });

    it('should map data object', function() {
      const escherRequestError = new EscherRequestError('', 0, { test: 'test' });
      const error = SuiteRequestError.createFromEscherRequestError(escherRequestError);

      expect(error.data).to.eql({ test: 'test' });
    });

    it('should map data object with data property', function() {
      const escherRequestError = new EscherRequestError('', 0, { data: { test: 'test' } });
      const error = SuiteRequestError.createFromEscherRequestError(escherRequestError);

      expect(error.data).to.eql({ test: 'test' });
    });

    it('should map data object with nested data properties', function() {
      const escherRequestError = new EscherRequestError('', 0, { data: { data: { test: 'test' } } });
      const error = SuiteRequestError.createFromEscherRequestError(escherRequestError);

      expect(error.data).to.eql({ data: { test: 'test' } });
    });
  });
});
