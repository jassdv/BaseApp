//console.log('IIIIIIIIIIIIIIIIin user model');

var Sequelize = require('sequelize')
var db = require('../index.js');
const crypto = require('crypto');
const _ = require('lodash');

/*
User database: holds all information about a Discover user
taken from signup form
 */
const User = module.exports =  db.define('user',{
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      isEmail: true,
      allowNull: false
    },
    password: {
    type: Sequelize.STRING
     },
     salt: {
      type: Sequelize.STRING
     },
     account_state: {
      type: Sequelize.ENUM('trial','active','inactive','deleted')
     },
     payment_amount: {
         type: Sequelize.INTEGER
     },
     admin: {
         type: Sequelize.BOOLEAN  
     }
     
    },{
      hooks: {
            beforeCreate: setSaltAndPassword,
        beforeUpdate: setSaltAndPassword
    
      },
      getterMethods: {
        fullName() {
          return (this.firstName+' '+this.lastName);
        }
      }
    });
    
    //class Methods
    User.encryptPassword = function(plainText, salt){
      const hash = crypto.createHash('sha1');
      hash.update(plainText);
      hash.update(salt);
      return hash.digest('hex');
    
    }
    
    
    //instance Methods:
    User.prototype.correctPassword = function(candidatePassword){
      return User.encryptPassword(candidatePassword, this.salt) === this.password;
    
    }
    
    User.prototype.sanitize = function(){
      return _.omit(this.toJSON(), ['password', 'salt']);
    }
    
    
    
    function generateSalt1 () {
        return crypto.randomBytes(16).toString('base64');	//Base64 a binary-to-text encoding
    }
    
    function encryptPassword1 (plainText, salt) {
        const hash = crypto.createHash('sha1');
        hash.update(plainText);
        hash.update(salt);
        return hash.digest('hex');
    }
    
    //setSaltAndPassword creates a salt and an encypted password 
    //for a user 
    function setSaltAndPassword (user) {
      // we need to salt and hash again when the user enters their password for the first time
      // and do it again whenever they change it
      if (user.changed('password')) {
        user.salt = generateSalt1();
        user.password = encryptPassword1(user.password, user.salt);
      }
    
    }
    

     