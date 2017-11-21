'use strict';
var Sequelize = require('sequelize')
var db = require('../index.js');

/*
data set model: holds a list of all datasets
 */
const Data_set = db.define('data_set', {
    dataset: Sequelize.STRING
});

module.exports = Data_set;