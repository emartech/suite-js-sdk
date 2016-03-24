'use strict';

const moment = require('moment-timezone');


module.exports = {

  getCurrentDate: function() {
    return moment.tz('Europe/Vienna').format('YYYY-MM-DD HH:mm:ss');
  }

};
