'use strict';

var moment = require('moment');


module.exports = {

  getCurrentDate: function() {
    return moment.utc().format('YYYY-MM-DD HH:mm:ss');
  }

};
