'use strict';

var util = require('util');
var _ = require('lodash');
var logger = require('logentries-logformat')('suite-sdk');

var Base = require('../_base');

var Form = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(Form, Base);

_.extend(Form.prototype, {

  list: function(payload, options) {
    logger.log('form_list');

    return this._request.get(
      this._getCustomerId(options),
      this._buildUrl('/form', payload),
      options
    );
  }

});

Form.create = function(request, options) {
  return new Form(request, options);
};

module.exports = Form;
