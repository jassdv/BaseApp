'use strict';
var Sequelize = require('sequelize')
var db = require('../index.js');


/*
company  model: holds company names and for each company,
its 'account state' that can be one of the following options: 
trial,active,inactive,deleted
 */
const Company = db.define('company', {
    name: Sequelize.STRING,
    account_state: Sequelize.ENUM('trial','active','inactive','deleted')
},{
    scopes: {
        populated: () => ({
            include: [{
                model: db.model('industry'),
                as: 'industry'
              }]

        }) 
    }
        

});

module.exports = Company;
