

const router = require('express').Router();
const User = require('../db/models/user');
const passport = require('passport');
const Industry = require('../db/models/industry');
const Employee_title = require('../db/models/employee_title');
const Timezone = require('../db/models/timezone');
const QuantitySKU = require('../db/models/quantity_SKU');
const Dataset = require('../db/models/data_set');
const Company = require('../db/models/company');
const request = require('request');

/************************************************************** 
 * we would need a function here that returns current lohgged user
 * should be implemented with Okta's APIs
 **************************************************************
// check currently-authenticated user, i.e. "who am I?"
router.get('/me', function (req, res, next) {
  // with Passport:
  console.log("req .session",req.session);
  console.log("%%%%%%%%req .session",req.session);
  console.log('req.user:::::',req.user);
  
  res.send(req.user);

  
});
*/
/*
login route
When the user logs into e-commerce the frontend routes here
this is the function that calls Okta's Access Token API for login and SSO
 */
router.post('/login',function(req,res,next){
  var options = { 
    method: 'POST',
    url: 'https://dev-120406.oktapreview.com/oauth2/default/v1/token',
    headers: 
    { 'postman-token': '11baf0dd-9792-2f4f-bd36-dfdd88de439f',
      'cache-control': 'no-cache',
      'authorization': 'Basic MG9hY3BndTBqN2htNG42ZnEwaDc6bmttZ2l2alI4U2d4OG1GNE9wN2tHRkN0Y0V3cmMwWmtmU2tNbVdaRQ==',
      'content-type': 'application/x-www-form-urlencoded' },
    form: 
    { scope: 'offline_access',
      username: req.body.email,
      grant_type: 'password',
      password: req.body.password 
    } 
  };

  //useing request module for asynchroneouse call to Okta
request(options, function (error, response, body) {
  if (error) throw new Error(error);

  
  res.send(body);
});

});

/*
redirect to FD route
After the user gets access token from Okta 
the front end routes here to send the FD redirect API
the function returns FD support page
*/
router.post('/redirect_fd',function(req,res,next){
  var options = { 
  method: 'GET',
  //followRedirect: false,
  url: 'http://njtestshib.corp.1010data.com/osupport/api/v1.0',
  headers: 
   { 'postman-token': '4ba70d40-b5c9-840f-31ff-a060f0e3fe4f',
     'cache-control': 'no-cache',
     'authorization': 'Bearer '+ req.body.access_token,
     'User-Agent': 'request'
     
   } 
  };
  
//useing request module for asynchroneouse call to 1010data server
//where the support page is hosted
let r = request(options, function (error, response, body) {
  if (error) throw new Error(error);

  
  res.send(response);

  
});

});


/*
signup route
the first step of signup, after the user submits their name, email, password, company
the front end routes here to sent a create user request to Okta
The function returns the user id and the account status ("staged" - the status prior activated)
*/
router.post('/signup', function (req, res, next) {
  var request = require("request");
  
  var options = { 
    method: 'POST',
    url: 'https://dev-120406.oktapreview.com/api/v1/users',
    qs: { activate: 'false' },
    headers: 
     { 'postman-token': 'f95508e5-cc36-a79f-a9fe-05b0ca93f331',
       'cache-control': 'no-cache',
       'authorization': 'SSWS 00XF7vA6v6gVB_h0f-xKNllmxhw6AZFV2TEVLqA0Uu',
       'content-type': 'application/json',
       'accept': 'application/json'
    },
    body: 
     { profile: 
        { firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          login: req.body.email,
          company: req.body.company_name },
       credentials: 
        { password: { value: req.body.password }},
        groupIds: ["00gcsb5ip1KFAMYHz0h7"] 
      },
    json: true 
  };

  //useing request module for asynchroneouse call to to Okta
  //by using Okta API
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  
    console.log(body);
    res.send(body);
  });
});


  

/*
enroll_email route
After the user signed up, Discover e-commerce enrols email factor 
authentication. The API used here, sends an email to the user with an activation passcode
The function returns an email factor id, yet, e-commerce doesnt use it, it is just an indication
for success
*/
router.post('/enroll_email', function(req,res,next){
  var request = require("request");
  
  var options = { method: 'POST',
  url: "https://dev-120406.oktapreview.com/api/v1/users/"+req.body.user_id+"/factors",
  qs: { tokenLifetimeSeconds: '1000' },
  headers: 
   { 'postman-token': '809ad4a2-3b9e-deb5-aa58-063095d4d94f',
     'cache-control': 'no-cache',
     authorization: 'SSWS  00XF7vA6v6gVB_h0f-xKNllmxhw6AZFV2TEVLqA0Uu',
     'content-type': 'application/json',
     accept: 'application/json' },
  body: 
   { factorType: 'email',
     provider: 'OKTA',
     profile: { email: req.body.email } },
  json: true 
};

  //useing request module for asynchroneouse call to to Okta
  //by using Okta API
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  
    
    res.send(body);
  });
  

});

/*
activate email factor route
After the user submits the passcode they got in the email
e-commerce send this API to "Activate and validate" the email factor authentication
if this function returns success, e-commerce activates the user
*/
router.post('/activate_email_factor', function(req,res,next){
  var request = require("request");
  
  var options = { 
    method: 'POST',
    url: "https://dev-120406.oktapreview.com/api/v1/users/"+req.body.user_id+"/factors//lifecycle/activate",
    headers: 
     { 'postman-token': 'ebdec421-1f57-5656-7ba3-5ca61c3cc2a4',
       'cache-control': 'no-cache',
       authorization: 'SSWS 00XF7vA6v6gVB_h0f-xKNllmxhw6AZFV2TEVLqA0Uu',
       'content-type': 'application/json',
       accept: 'application/json' },
    body: { passCode: req.body.passCode },
    json: true
    
  };
  
  //useing request module for asynchroneouse call to to Okta
  //by using Okta API
  console.log("options body", options.body);
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  
    
    res.send(body);
  });
  });

  /*
  activate user route
  if email factor activation returns success, Discover e-commerce
  activates the user.
  This function on success returns the new status "ACTIVATE"
  */
  router.post('/activate_user', function(req,res,next){
    var request = require("request");
    
    var options = { 
      method: 'POST',
      url: "https://dev-120406.oktapreview.com/api/v1/users/"+req.body.user_id+"/lifecycle/activate",
      qs: { sendEmail: 'false' },
      headers: 
       { 
         'postman-token': 'c2dbb14e-0578-43a1-f6e8-391c6af63be9',
         'cache-control': 'no-cache',
         authorization: 'SSWS 00XF7vA6v6gVB_h0f-xKNllmxhw6AZFV2TEVLqA0Uu',
         accept: 'application/json',
         'content-type': 'application/json' 
        },
        json: true
       };
    
    //useing request module for asynchroneouse call to to Okta
    //by using Okta API
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
    
      console.log(body);
      res.send(body);
    });
    

  });



//put request to add preferences to a newly created user
router.put('/signup', function (req, res, next) {
  console.log('in put signup user', req.user);
  
  User.findById(req.user.id,{
    include: [ Dataset ]
  })
  .then((user) => {
    if(req.body.paymentAmount){
      user.update({
        payment_amount: req.body.paymentAmount
      });

    }
    if(req.body.datasetIds){
      user.addData_sets(req.body.datasetIds);
    }
    if(req.body.time_zone_id){
      user.update({
        time_zone_id: req.body.time_zone_id
      });

    }
    if(req.body.quantity_s_k_u_id){
      user.update({
        quantity__s_k_u_id: req.body.quantity_s_k_u_id
      });

    }
    res.status(201).json(user);
  })
  .catch(next);
});

//updating user's information
router.put('/:userId', function(req,res,next){
  console.log('got to user id put');
  const id = req.params.userId;
  console.log('user id',id);
  User.findById(id)
  .then(user => {
    return user.update(req.body);
  })
  .then(user => {
    res.status(200).json(user);
  })
  .catch(next);

});




// logout, i.e. "please just forget `me`"
router.delete('/logout', function (req, res, next) {
  // with Passport
  console.log('in logout req.user',req.user);
  req.logOut();
  res.sendStatus(204);
});


/*
The following functions fetch data from the GUDB (Golbal User Data Base)
or add new data to it
returns data to the front end to load on the lists in the signup form
 */
//fetching intustry title list
router.get('/industry',function(req,res,next) {
    Industry.findAll({})
        .then( industries => {
            console.log('GOT INDUSTRIES:',industries);
            res.status(200).json(industries)})
        .catch(next);
      });



//fetching employee title list
router.get('/employee_title',function(req,res,next) {
  console.log('GOT EMPLOYEE TITLES - TITLES:',Employee_title);
  Employee_title.findAll({})
      .then( titles => {
          console.log('GOT titles:',titles);
          res.status(200).json(titles)})
      .catch(next);
    });


//fetching all time zones
router.get('/timezone',function(req,res,next) {
  Timezone.findAll({})
      .then( timezones => {
          console.log('GOT time zones:',timezones);
          res.status(200).json(timezones)})
      .catch(next);
    });

//fetching all quantities and SKUs
router.get('/quantity_SKU',function(req,res,next) {
  QuantitySKU.findAll({})
      .then( values => {
          console.log('GOT quantities and SKUs:',values);
          res.status(200).json(values)})
      .catch(next);
    });


//fgetching all data sets
router.get('/dataset',function(req,res,next) {
  Dataset.findAll({})
      .then( values => {
          console.log('GOT Data sets:',values);
          res.status(200).json(values)})
      .catch(next);
    });

//fetching all companies or the account_state options
router.get('/company',function(req,res,next) {
  if(req.query.state === 'true'){
    console.log('GOT QUERY');
    let accountStates = Company.rawAttributes.account_state.values;
    res.status(200).send(accountStates);

  }
  else{
    Company.findAll({})
    .then( values => {
        console.log('GOT Data sets:',values);
        res.status(200).json(values)})
    .catch(next);
  }
});

//adding a new company to the companies table
router.put('/api/company', function(req,res,next){
  Company.create({
    name: req.body.name,
    account_state: req.body.account_state,
    industry_id: req.body.industry_id

  }).then((company)=>{
    res.status(201).json(company);

  }).catch(next);

});


module.exports = router;


