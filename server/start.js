const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const pkg = require('../package.json'); 
var db = require('../db/models');





//looging data
app.use(morgan('dev'));

//serving statuc files
app.use(express.static(path.join(__dirname, '../public')));

//using body-parser to easially parse body information in req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//using cookie-parser
app.use(cookieParser());





//for internal server problems, sends 500 error message
app.use(function (err, req, res, next) {
  //console.log('in error handling res',res);
  console.error(err.message);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});


//setting the session in the middleware, the session hold
//information about the current user
//on our deployment server, we can set an environment variable called SESSION_SECRET with our real secret
app.use(session({
  secret: process.env.SESSION_SECRET || 'a wildly insecure secret',
  resave: false,
  saveUninitialized: false
}));

//set up to use flash for storing messages from the session
app.use(flash());

//initializing passport to get req.session with the user info on it
// app.use(passport.initialize());
// app.use(passport.session());
app.use(require('./passport_middleware'));



//when there is '/api' in the rout, look in api.js for the 
//routing redirection
app.use('/api', require('./api'));

//starting up the server:
const port = process.env.PORT || 3000; 
// app.listen(port, function () {
//   console.log(`*** starting server, listening on port ${port} ***`);
// });



//syncing the user table in the data base
// db_

const server = app.listen(
  process.env.PORT || 3000,
  () => {
    console.log(`--- Started HTTP Server for ${pkg.name} ---`)      
    console.log(`Listening on ${JSON.stringify(server.address())}`)
    db.sync({})
    .then(()=>{
      console.log('---syncing db---');
    });
  }
)





//force: true