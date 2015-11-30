'use strict';

var SuiteAPI = require('../').api;

console.log('creating suite api');

var suiteAPI = SuiteAPI.create({
  customerId: 218721181
});

console.log('getting admins');

suiteAPI.administrator.getAdministrators({
  //apiKey: 'suite_experiment_v2'
}).then(function(admins) {
  console.log(admins);
}).catch(function(err) {
  console.log(err);
});

//suiteAPI.email.list({
//  customerId: 218721181
//}).then(function (admins) {
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
