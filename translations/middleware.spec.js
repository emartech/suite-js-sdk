'use strict';

var expect = require('chai').expect;
var FakeContext = require('../test-mocks').FakeContext;
var FakeDecorator = require('../test-mocks').FakeTranslationRenderDecorator;
var translationsDecoratorMiddleware = require('./middleware');
var SuiteAPI = require('../api');
var nock = require('nock');
var Translator = require('./translator');
var TranslateRenderDecorator = require('./render-decorator');

describe('Suite translation middleware', function() {

  describe('#decorateRenderWithTranslations', function() {
    var context;
    var next;
    var fakeApi;
    var fakeResponseForTranslations;
    var validValidatedData;

    beforeEach(function() {
      next = function*() { next.called = true; };
      next.called = false;

      context = FakeContext.create();
      context.id = 5;

      fakeApi = {
        administrator: {
          getAdministrator: this.sandbox.stub()
        }
      };

      validValidatedData = {
        environment: 'testEnvironment',
        customer_id: '12',
        admin_id: '21'
      };

      fakeResponseForTranslations = { messages: 'from mock' };

      this.sandbox.stub(SuiteAPI, 'createWithCache').returns(fakeApi);

      fakeApi.administrator.getAdministrator
        .withArgs({ administrator_id: validValidatedData.admin_id }, { customerId: validValidatedData.customer_id })
        .returnsWithResolve({ interface_language: 'mx' });
    });

    afterEach(function() {
      nock.cleanAll();
    });


    it('should keep the original render data', function* () {
      httpBackendRespondWith(200, 'mx', fakeResponseForTranslations);

      var renderData = { someData: 1 };
      context.setValidatedData(validValidatedData);

      yield translationsDecoratorMiddleware.decorateRenderWithTranslations().call(context, next);
      yield context.render('local.view.render', renderData);

      expect(context.getLastRenderData()).to.containSubset({
        someData: 1
      });
      expect(next.called).to.be.true;
    });

    it('should pass api options', function* () {
      var testApiOptions = { host: 'tempuri.org' };
      this.sandbox.stub(TranslateRenderDecorator, 'create').returns(FakeDecorator);

      yield translationsDecoratorMiddleware.decorateRenderWithTranslations(testApiOptions).call(context, next);
      expect(TranslateRenderDecorator.create).to.have.been.calledWith(context, testApiOptions);
    });


    it('should add admin\'s language translations to the render data', function* () {
      httpBackendRespondWith(200, 'mx', fakeResponseForTranslations);

      var renderData = { someData: 1 };
      context.setValidatedData(validValidatedData);

      yield translationsDecoratorMiddleware.decorateRenderWithTranslations().call(context, next);
      yield context.render('local.view.render', renderData);

      expect(SuiteAPI.createWithCache).to.have.been.calledWith(context.id);
      expect(context.getLastRenderData()).to.containSubset({
        translations: fakeResponseForTranslations
      });
    });


    it('should add language translations with the provided language\'s dictionary if the validated data has language', function* () {
      httpBackendRespondWith(200, 'mx', fakeResponseForTranslations);

      context.setValidatedData({ environment: validValidatedData.environment, language: 'mx' });

      yield translationsDecoratorMiddleware.decorateRenderWithTranslations().call(context, next);
      yield context.render('local.view.render', {});

      expect(context.getLastRenderData()).to.containSubset({
        translations: fakeResponseForTranslations
      });
    });


    it('should add language translations with the default language\'s dictionary if environment and language is missing from validation data', function* () {
      httpBackendRespondWith(200, 'en', fakeResponseForTranslations);

      context.setValidatedData({ environment: validValidatedData.environment });

      yield translationsDecoratorMiddleware.decorateRenderWithTranslations().call(context, next);
      yield context.render('local.view.render', {});

      expect(context.getLastRenderData()).to.containSubset({
        translations: fakeResponseForTranslations
      });
    });


    it('should add translation method with admin\'s dictionary', function* () {
      var fakeTranslator = { translate: this.sandbox.spy() };
      this.sandbox.stub(Translator, 'create').returns(fakeTranslator);

      httpBackendRespondWith(200, 'mx', fakeResponseForTranslations);

      var renderData = { someData: 1 };
      context.setValidatedData(validValidatedData);

      yield translationsDecoratorMiddleware.decorateRenderWithTranslations().call(context, next);
      yield context.render('local.view.render', renderData);

      expect(context.getLastRenderData()).to.containSubset({
        _: fakeTranslator.translate
      });
      expect(Translator.create).to.have.been.calledWith(fakeResponseForTranslations);
    });


    it('should add empty admin\'s language translations to the render data if the request fails', function* () {
      httpBackendRespondWith(200, 'mx', null);

      var renderData = { someData: 1 };
      context.setValidatedData(validValidatedData);

      yield translationsDecoratorMiddleware.decorateRenderWithTranslations().call(context, next);
      yield context.render('local.view.render', renderData);

      expect(context.getLastRenderData()).to.containSubset({
        translations: {}
      });
    });


    it('should add admin\'s language translations from cache after the first request', function* () {
      httpBackendRespondWith(200, 'mx', fakeResponseForTranslations);

      context.setValidatedData(validValidatedData);

      yield translationsDecoratorMiddleware.decorateRenderWithTranslations().call(context, next);
      yield context.render('local.view.render', { anotherData: 2 });

      var renderData = { someData: 1 };
      yield translationsDecoratorMiddleware.decorateRenderWithTranslations().call(context, next);
      yield context.render('local.view.render', renderData);

      expect(context.getLastRenderData()).to.containSubset({
        translations: fakeResponseForTranslations
      });
    });


    it('should thrown an error if the context do not have validated data', function* () {
      try {
        context.setValidatedData(null);
        context.validatedData = null;
        yield translationsDecoratorMiddleware.decorateRenderWithTranslations().call(context, next);
      } catch (ex) {
        expect(next.called).to.be.false;
        expect(ex).to.be.an.instanceOf(Error);
        return expect(ex.message).to.eql('decorateRenderWithTranslations middleware need validatedData from request\'s');
      }

      throw new Error('Missed exception');
    });


    var invalidValidatedCases = [{
      message: 'if the context do no have environment and language_id',
      validatedData: {
        admin_id: 'admin_id',
        customer_id: 'customerId'
      }
    }];

    invalidValidatedCases.forEach(function(testCase) {
      it('should thrown an error ' + testCase.message, function* () {
        try {
          context.setValidatedData(testCase.validatedData);
          yield translationsDecoratorMiddleware.decorateRenderWithTranslations().call(context, next);
        } catch (ex) {
          expect(next.called).to.be.false;
          expect(ex).to.be.an.instanceOf(Error);
          return expect(ex.message).to.eql('decorateRenderWithTranslations middleware need environment from request\'s validatedData');
        }

        throw new Error('Missed exception');
      });
    });

  });


  var httpBackendRespondWith = function(errorCode, language, data) {
    nock('http://testEnvironment')
      .get('/js/translate/translate_um.js.php?lang=' + language)
      .times(1)
      .reply(errorCode, data);
  };
});
