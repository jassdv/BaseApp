import axios from 'axios';
import {Router, browserHistory } from 'react-router';
import { push } from 'react-router-redux'

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

/* --------------    ACTION CREATORS    ----------------- */

const set     = user => ({ type: SET, user });
const remove  = () => ({ type: REMOVE });
const login_error = (error_msg) => ({type: LOGIN_ERROR, error_msg});
const set_company = (companyId) => ({type: SET_COMPANY, companyId});
const set_user_id = (user_id) => ({type: SET_USER_ID, user_id});
const set_account_status = (account_status)=>({type: SET_ACCOUNT_STATUS, account_status});
const set_email_factor_id = (email_factor_id) => ({type: SET_EMAIL_FACTOR_ID, email_factor_id});
const set_user_email = (user_email) => ({type: SET_USER_EMAIL, user_email});

/* ------------------    REDUCER    --------------------- */

const initialAuthState = {
  currentUser: {},
  login_error: ""
}

//export default function reducer (currentUser = null, action) {
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
      case set_user_email:
        newState.currentUser.email = action.user_email;
        return newState;

      default:
        //return initialAuthState;
        return state;
  }
}

/* ------------       DISPATCHERS     ------------------ */

const resToData = res => res.data;

// a "simple" dispatcher which uses API, changes state, and returns a promise.
// export const login = credentials => dispatch => {
//   return axios.put('/api/login/local', credentials)
//   .then(resToData)
//   .then(user => {
//     dispatch(set(user));
//     return user;
//   });
// };

export const login = credentials => dispatch => {
  return axios.post('/api/login/local', credentials)
  .then((res) => {
    dispatch(retrieveLoggedInUser());
    return resToData;
  }).catch(err => {
    if(err.response){
      console.log("in login, got an error",err.response.statusText);
      return err.response.statusText;

    }
    //return axios.get('api/login/local')
    console.log("in login, got an error",err);
    return err;
  });
};

// a "composed" dispatcher which uses the "simple" one, then routes to a page.
// export const loginAndGoToUser = credentials => dispatch => {
//   dispatch(login(credentials))
//   .then(user => browserHistory.push(`/users/${user.id}`))
//   .catch(err => {
//     console.error('Problem logging in:', err)
//     return browserHistory.push('/login')
//   });
// };

export const loginAndGoToUser = credentials => dispatch => {
  dispatch(login(credentials))
  .then(res => {
    if(typeof res === 'string'){
      return dispatch(login_error(res));
      //return browserHistory.push('/login'); //send a local stet error message to show on the screen
      //return dispatch(push('/login'));

    }
    return browserHistory.push(`/users/${res.id}`)
  })
  .catch(err => {
    console.error('Problem logging in:', err)
    return browserHistory.push('/login')
  });
};

// export const signup = credentials => dispatch => {
//   return axios.post('/api/signup', credentials)
//   .then(resToData)
//   .then(user => {
//     dispatch(set(user)); // set current user
//     return user;
//   });
// };

export const signup = credentials => dispatch => {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://dev-120406.oktapreview.com/api/v1/users?activate=false",  // would need to change the Okta domain to be taken from a config file
    "method": "POST",
    "headers": {
      "accept": "application/json",
      "content-type": "application/json",
      "authorization": "SSWS 00XF7vA6v6gVB_h0f-xKNllmxhw6AZFV2TEVLqA0Uu", //would need to take the API key from a config file
      "cache-control": "no-cache",
      "postman-token": "e36725f8-b55c-4d60-3106-15d411bd83eb"             //what is POSTMAN token ???
    },
    "processData": false,
    "data": 
      {
          "profile": {
              "firstName": credentials.firstName,
              "lastName": credentials.lastName,
              "email": credentials.email,
              "login": credentials.email
              },
              "credentials": {
                "password" : { "value": credentials.password },
                "recovery_question": {
                  "question": "Who's your best friend?",                    //do we want a recovery question??
                  "answer": "lior"
                }
            }
      }
  }
  
  //debugger;
  return axios(settings)
  .then(resToData)
  .then(res => {
    debugger;
    console.log('res from create a new user',res);
    dispatch(set_user_id(res.id));
    dispatch(set_account_status(res.status));
    dispatch(set_user_email(res.profile.email));
    return enrollEmailFactor({"email": res.profile.email,"user_id": res.id});
    //return res.id;
  })
  .then(factor_id => {
    dispatch(set_email_factor_id(factor_id));
    return browserHistory.push('/passcode');
  })
  .catch(function(err){
    debugger;
    console.log("error:", err);
  });
  
};

export const enrollEmailFactor = credentials => {
  debugger;
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://dev-120406.oktapreview.com/api/v1/users/" + credentials.user_id + "/factors?tokenLifetimeSeconds=10000",
    "method": "POST",
    "headers": {
      "accept": "application/json",
      "content-type": "application/json",
      "authorization": "SSWS 00XF7vA6v6gVB_h0f-xKNllmxhw6AZFV2TEVLqA0Uu",
      "cache-control": "no-cache",
      "postman-token": "7e7d3ca1-280b-b200-4bbd-c1eeee98cba6"
    },
    "processData": false,
    "data": {
      "factorType": "email",
      "provider": "OKTA",
      "profile": {
        "email": credentials.email  
      }
    }
  }
  
  return axios(settings)
  .then(resToData)
  .then(res => {
    debugger;
    console.log('res from create a new user',res);
    // dispatch(set_email_factor_id(res.id));
    // //TODO: redirect to a "passcode" form page
    // return browserHistory.push('/passcode');
    return res.id;
  }).catch(function(err){
    debugger;
    console.log("error:", err);
  });
  
};

export const activateEmail = credentials => dispatch => { //credientials should gave: user_id, factor_id and passcode
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://dev-120406.oktapreview.com/api/v1/users/" + credentials.user_id + "/factors/"+ credentials.factor_id +"/lifecycle/activate",
    "method": "POST",
    "headers": {
      "content-type": "application/json",
      "accept": "application/json",
      "authorization": "SSWS 00XF7vA6v6gVB_h0f-xKNllmxhw6AZFV2TEVLqA0Uu",
      "cache-control": "no-cache",
      "postman-token": "254f6b76-73ef-07ae-6055-5050d17b1135"
    },
    "processData": false,
    "data": {
      "passCode": credentials.passCode
    }
  }
  
  return axios(settings)
  .then(resToData)
  .then(res => {
    console.log('res from create a new user',res);
    return true;

  })
  .catch(err => {
    debugger;
    console.log("error:", err);
    return false;

  });
};

export const activateUser = credentials => dispatch => {  //credentials should have user_id
  debugger;
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://dev-120406.oktapreview.com/api/v1/users/"+credentials.user_id+"/lifecycle/activate?sendEmail=false",
    "method": "POST",
    "headers": {
      "content-type": "application/json",
      "accept": "application/json",
      "authorization": "SSWS 00XF7vA6v6gVB_h0f-xKNllmxhw6AZFV2TEVLqA0Uu",
      "cache-control": "no-cache",
      "postman-token": "4e6c868e-f78b-2f04-3a6b-d03afba8de7c"
    }
  }
  
  return axios(settings)
  .then(resToData)
  .then(res => {
    console.log('res from create a new user',res);
    //TODO:set the user to be {} again since they now need to login
    dispatch(set_account_status(res.status));
    return browserHistory.push('/login');
  }).catch(err => {
    debugger;
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


export const signupAndGoToUser = credentials => dispatch => {
  dispatch(signupPreferences(credentials))
  .then(user => browserHistory.push(`/users/${user.id}`))
  .catch(err => console.error('Problem signing up:', err));
};

//a function that sends signs the user in the data base and redirects
//to the set-preferences page
export const signupAndGoToUSetPreferences = credentials => dispatch => {
  dispatch(signup(credentials))
  .then(user => browserHistory.push('/signup_preferences'))
  .catch(err => console.error('Problem signing up:', err));
};

//signup and go to payment
export const signupAndGoToPayment = credentials => dispatch => {
  dispatch(signupPreferences(credentials))
  .then(user => browserHistory.push('/signup_payment'))
  .catch(err => console.error('Problem signing up:', err));
};

export const retrieveLoggedInUser = () => dispatch => {
  axios.get('/api/me')
  .then(resToData)
  .then(user => {
  	return dispatch(set(user))})
  .catch(err => console.error('Problem fetching current user', err));
};

// optimistic
export const logout = () => dispatch => {
  dispatch(remove());
  axios.delete('/api/logout')
  .then(err => console.log('logout unsuccessful', err));
};

export const updateUserAccount = (userId, credentials) => dispatch => {
  console.log('got to updateUserAccount',userId,credentials);
  return axios.put(`/api/${userId}`, credentials) //////$$$$continue here
  .then(resToData)
  .then(user => {
    dispatch(set(user)); // set current user
    browserHistory.push(`/users/${user.id}`);
    return user;
  });
};

export const setCompany = (compoanyId) => dispatch => {
  return dispatch(set_company(compoanyId));
}
/*
dispatch => {
  dispatch(update(credentials))
  .then(user => browserHistory.push('/signup_payment'))
  .catch(err => console.error('Problem signing up:', err));
};
*/



/*
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://dev-120406.oktapreview.com/api/v1/users?activate=false",
  "method": "POST",
  "headers": {
    "accept": "application/json",
    "content-type": "application/json",
    "authorization": "SSWS 00XF7vA6v6gVB_h0f-xKNllmxhw6AZFV2TEVLqA0Uu",
    "cache-control": "no-cache",
    "postman-token": "e36725f8-b55c-4d60-3106-15d411bd83eb"
  },
  "processData": false,
  "data": "{\n  \"profile\": {\n    \"firstName\": \"eli\",\n    \"lastName\": \"Test\",\n    \"email\": \"eliavtes248@gmail.com\",\n    \"login\": \"eliavtes248@gmail.com\"\n  },\n  \"credentials\": {\n    \"password\" : { \"value\": \"HelloEli248\" },\n    \"recovery_question\": {\n      \"question\": \"Who's your best friend?\",\n      \"answer\": \"lior\"\n    }\n  }\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
 */