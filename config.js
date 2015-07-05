var config = {

  CACHE_TTL: 120,
  API_PROXY_URL: 'api.emarsys.net',

  suiteApi: {
    environment: process.env.SUITE_API_ENVIRONMENT,
    rejectUnauthorized: process.env.SUITE_API_REJECT_UNAUTHORIZED,
    apiKey: process.env.SUITE_API_KEY,
    apiSecret: process.env.SUITE_API_SECRET,
    keyPool: process.env.KEY_POOL,
    keyId: process.env.SUITE_API_KEY_ID
  }

};

module.exports = config;
