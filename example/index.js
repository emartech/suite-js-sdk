var SuiteAPI = require('../').api;

var suiteAPI = SuiteAPI.create({
  customerId: 218721181
});

suiteAPI.administrator.getInterfaceLanguages(218721181).then(function (admins) {
  console.log(admins);
}).catch(function (err) {
  console.log(err);
});

//suiteAPI.email.list(218721181).then(function (admins) {
//  console.log(admins);
//}).catch(function (err) {
//  console.log(err);
//});

//suiteAPI.administrator.getAdministrators({
//  customerId: 218721181
//}).then(function (admins) {
//  console.log(admins);
//}).catch(function (err) {
//  console.log(err);
//});
