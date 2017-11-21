'use strict';
var Sequelize = require('sequelize')
var db = require('../index.js');

/*
Industry model: holds a list of industry titles
 */
const Industry = db.define('industry', {
    title: Sequelize.STRING
});

module.exports = Industry;