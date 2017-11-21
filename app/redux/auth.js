import axios from 'axios';
import {Router, browserHistory } from 'react-router';
import { push } from 'react-router-redux';

const DiscoverOktaOrg = "dev-120406.oktapreview.com";
/* ------------------    ACTIONS    --------------------- */
const SET = 'SET_CURRENT_USE';
const REMOVE = 'REMOVE_CURRENT_USER';
const LOGIN_ERROR = 'LOGIN_ERROR';
const SET_COMPANY = 'SET_COMPANY';
const SET_USER_ID = 'SET_USER_ID';
const SET_ACCOUNT_STATUS = 'SET_ACCOUNT_STATUS';
const SET_EMAIL_FACTOR_ID = 'SET_EMAIL_FACTOR_ID';
const SET_USER_EMAIL = 'SET_USER_EMAIL';
const SET_ACCESS_TOKRN =  'SET_ACCESS_TOKRN';
/* --------------    ACTION CREATORS    ----------------- */

const set     = user => ({ type: SET, user });
const remove  = () => ({ type: REMOVE });
const login_error = (error_msg) => ({type: LOGIN_ERROR, error_msg});
const set_company = (companyId) => ({type: SET_COMPANY, companyId});
const set_user_id = (user_id) => ({type: SET_USER_ID, user_id});
const set_account_status = (account_status)=>({type: SET_ACCOUNT_STATUS, account_status});
const set_email_factor_id = (email_factor_id) => ({type: SET_EMAIL_FACTOR_ID, email_factor_id});
const set_user_email = (user_email) => ({type: SET_USER_EMAIL, user_email});
const set_access_token = (access_token) => ({type: SET_ACCESS_TOKRN,access_token });

/* ------------------    REDUCER    --------------------- */

/*the auth state. In every single moment 
all app components need to have access to the current logged user
we also save here error messages, in the future we can use them in 
tooltips or error messages on the screen
*/
const initialAuthState = {
  currentUser: {},
  login_error: ""
}

  //Auth reducer, this is the function that updates the app global store
  export default function reducer (state=initialAuthState, action) {
    const newState = Object.assign({}, state);
    switch (action.type) {

      case SET:
        return Object.assign({}, state, {currentUser: action.user, login_error: ""})

      case REMOVE:
        return Object.assign({}, state, {currentUser: null})

      case LOGIN_ERROR:
        return Object.assign({}, state, {login_error: action.error_msg})

      case SET_COMPANY:
        newState.currentUser.company_id = parseInt(action.companyId);
        return newState;
      case SET_USER_ID:
        newState.currentUser.user_id = action.user_id;
        return newState;
      case SET_ACCOUNT_STATUS:
        newState.currentUser.account_status = action.account_status;
        return newState;
      case SET_EMAIL_FACTOR_ID:
        newState.currentUser.email_factor_id = action.email_factor_id;
        return newState;
      case SET_USER_EMAIL:
        newState.currentUser.email = action.user_email;
        return newState;
      case SET_ACCESS_TOKRN:
        newState.currentUser.access_token = action.access_token;
        return newState;
      default:
        //return initialAuthState;
        return state;
  }
}

/* ------------       DISPATCHERS     ------------------ */

//converting retun responses from middleware to the data 
//we need here to update the store
const resToData = res => res.data;

/*
Login:
When the user press "submit" in the login page
this is the function that is called. 
input: user credentials
the function calls the backend login to send the info to Okta
if success: the function updates the store with the current user and 
the access token and redirect to "service provides" page where the user
can click on the a link to the the SP they want to go to
 */
export const login = credentials => dispatch => {
   return axios.post('/api/login', credentials)
   .then(resToData)
   .then(res => {
    //debugger;
    dispatch(set_user_email(credentials.email));
    dispatch(set_access_token(res.access_token));
    return browserHistory.push('/service_providers'); 
  })
  .catch(err => {
    console.log("in login, got an error",err);
  });
   
};

/*
redirectFD:
When the user clicks on "support" in the service provicers
page, this function is being called for Fresh Desk redirecting
 */
export const redirectFD = access_token => dispatch => {
  
  return axios.post('/api/redirect_fd', {"access_token": access_token})
  .then(resToData)
  .then(res => {
    console.log("got back to redirectFD front end res", res);
    
   //return res.headers.location;
   return "http:google.com";
  
  })
  .catch(err => {
    console.log("in redirect FD, got an error",err);
  });

}

/*
signup:
The first step of signing up a user to Okta is calling the create user Okta API
This function is called when the user presses submit in the first signup form
input: user credentials
The function calls the backend signup function that sends the create user API to Okta
*/
export const signup = credentials => dispatch => {
  
  return axios.post('/api/signup', credentials)
  .then(resToData)
  .then(res => {
    //all dispatch function are for updating the app store
    dispatch(set_user_id(res.id));
    dispatch(set_account_status(res.status));
    dispatch(set_user_email(res.profile.email));
    return enrollEmailFactor({"email": res.profile.email,"user_id": res.id});
    
  })
  .then(factor_id => {
    dispatch(set_email_factor_id(factor_id));
    return browserHistory.push('/passcode');
  })
  .catch(function(err){
    console.log("error:", err);
  });
  
};

/*
enrollEmailFactor:
After signup is completed successfully, e-commerce enrolls the 
second factor authentication which is the email factor.
This function calls the backend enroll email factor function that calls the
appropriate Okta API
 */
export const enrollEmailFactor = credentials => {
  
  return axios.post('/api/enroll_email', credentials)
  .then(resToData)
  .then(res => {
    debugger;
    console.log('res from create a new user',res);
    
    return res.id;
  }).catch(function(err){
    
    console.log("error:", err);
  });
  
};

/*
activateEmail:
After rge user enters the passcode they got in the email, Dicover
e-commerce "activates" the email factor by sending the passcode to Okta.
input: user credentials: user_id and passCode
this function calls the backend activate email function that activates
the email by sending the suitable Okta API
*/
export const activateEmail = credentials => dispatch => { //credientials should gave: user_id, factor_id and passcode
  
  return axios.post('/api/activate_email_factor',credentials)
  .then(resToData)
  .then(res => {
    console.log('res from create a new user',res);
    return true;

  })
  .catch(err => {
    console.log("error:", err);
    return false;

  });
};

/*
activateUser:
After activating the email the email factor successfully, Discover e-commerce
activates the user.
input: user  credentials that includes user_id
this function calls the backend activate user which activates the user by sending the suitable
Okta API
*/
export const activateUser = credentials => dispatch => {  //credentials should have user_id
  
  return axios.post('/api/activate_user',credentials)
  .then(resToData)
  .then(res => {
    debugger;
    console.log('res from create a new user',res);
    dispatch(set_account_status(res.status));
    return browserHistory.push('/login');
  }).catch(err => {
    console.log("error:", err);
  });
}

//signPreferences: update the new created user with their preferences
//step2 in signup process
export const signupPreferences = credentials => dispatch => {
  return axios.put('/api/signup', credentials)
  .then(resToData)
  .then(user => {
    dispatch(set(user)); // set current user
    return user;
  });
};

/*
signupAndGoToUser: 
This function is currently not in used
*/
export const signupAndGoToUser = credentials => dispatch => {
  dispatch(signupPreferences(credentials))
  .then(user => browserHistory.push(`/users/${user.id}`))
  .catch(err => console.error('Problem signing up:', err));
};


/*
signupAndGoToPayment: 
This function is currently not in used
*/
export const signupAndGoToPayment = credentials => dispatch => {
  dispatch(signupPreferences(credentials))
  .then(user => browserHistory.push('/signup_payment'))
  .catch(err => console.error('Problem signing up:', err));
};

/*
retrieveLoggedInUser:
retrieves the logged user and update the store
 */
export const retrieveLoggedInUser = () => dispatch => {
  axios.get('/api/me')
  .then(resToData)
  .then(user => {
  	return dispatch(set(user))})
  .catch(err => console.error('Problem fetching current user', err));
};

/*
logs out
*/
export const logout = () => dispatch => {
  dispatch(remove());
  axios.delete('/api/logout')
  .then(err => console.log('logout unsuccessful', err));
};

/*
updateUserAccount:
when a user changes their account data, this function is called
input: user credentials
this function sends the info to the suitable backend route to update Okta and 
the GUDB
*/
export const updateUserAccount = (userId, credentials) => dispatch => {
  console.log('got to updateUserAccount',userId,credentials);
  return axios.put(`/api/${userId}`, credentials) 
  .then(resToData)
  .then(user => {
    dispatch(set(user)); 
    browserHistory.push(`/users/${user.id}`);
    return user;
  });
};

/*
setCompany
when the user changes their company, this function is called
*/
export const setCompany = (compoanyId) => dispatch => {
  return dispatch(set_company(compoanyId));
}
