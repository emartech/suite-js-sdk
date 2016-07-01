'use strict';

var config = {

  CACHE_TTL: 120,
  API_PROXY_URL: 'api.emarsys.net',

  suiteApi: {
    environment: process.env.SUITE_API_ENVIRONMENT,
    rejectUnauthorized: process.env.SUITE_API_REJECT_UNAUTHORIZED !== 'false',
    apiKey: process.env.SUITE_API_KEY,
    apiSecret: process.env.SUITE_API_SECRET,
    keyPool: process.env.SUITE_API_KEY_POOL || process.env.KEY_POOL,
    keyId: process.env.SUITE_API_KEY_ID,
    secure: process.env.SUITE_API_SECURE !== 'false',
    port: typeof process.env.SUITE_API_PORT !== 'undefined' ?
      process.env.SUITE_API_PORT :
      (process.env.SUITE_API_SECURE === 'false' ? 80 : 443),
    timeout: process.env.SUITE_API_TIMEOUT || 15000
  }

};

module.exports = config;
