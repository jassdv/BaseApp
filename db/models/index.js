'use strict';

var db = require('../');
var User = require('./user');
var Employee_title = require('./employee_title');
var Industry = require('./industry');
var Timezone = require('./timezone');
var Quantity_SKU = require('./quantity_SKU');
var Data_set = require('./data_set');
var Company = require('./company');

console.log('in assosiating idex user',User);
console.log('in assosiating idex employee',Employee_title);
console.log('in assosiating idex industry',Industry);
console.log('in assosiating idex time zone',Timezone);
console.log('in assosiating idex quantity and SKU',Quantity_SKU);
console.log('in assosiating idex data set',Data_set );
console.log('in assosiating idex company',Company );



User.belongsTo(Employee_title,{through: 'employee_title_id'});
User.belongsTo(Timezone,{through: 'Timezone_id'});
User.belongsTo(Quantity_SKU,{through: 'Quantity_SKU_id'});
User.belongsTo(Company, {through: 'company_id'});
User.belongsToMany(Data_set, {through: 'user_dataset'});
Data_set.belongsToMany(User, {through: 'user_dataset'});
Company.belongsTo(Industry,{through: 'industry'});

console.log('DONE BELONGS TO');

module.exports = db;