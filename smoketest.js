'use strict';

const SuiteAPI = require('./').api;
const suiteAPI = SuiteAPI.create({
  customerId: process.env.CUSTOMER_ID,
  port: 443
});

suiteAPI.contactList.list()
  .then(() => suiteAPI.contact.create({
    '3': `smoke.test-${Math.floor(Math.random() * 100000)}@no-domain.wuuu`
  }))
  .then((contact) => suiteAPI.contact.update({
    key_id: contact.id
  }))
  .catch((err) => {
    console.log('smoketests failed', err);
    process.exit(-1);
  });
