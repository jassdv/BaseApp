'use strict';
var Sequelize = require('sequelize')
var db = require('../index.js');

console.log('IIIIIIIIIIIIIIIIin employee title');


/*
Employee title model: holds a list of employee titles
 */
const Employee_title = db.define('employee_title', {
    title: Sequelize.STRING
});

module.exports = Employee_title;