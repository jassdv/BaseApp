import React from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import UserDetail from './components/UserDetail';
import Root from './components/Root';
import SignupPreferences from './components/SignupPreferences';
import  SignupPayment  from './components/SignupPayment';
import addCompany from './components/addCompany';
import UserSettings from './components/UserSettings';
import Passcode from './components/Passcode';
//import Logout from './components/Logout';
import { retrieveLoggedInUser } from './redux/auth';
import { fetchIndustries } from './redux/industry';
import { fetchEmployeeTitles } from './redux/employee_title';
import { fetchTimezones } from './redux/timezone';
import { fetchQuantitySKUs } from './redux/quantity_SKU';
import { fetchDataSets } from './redux/data_set';
import { fetchDCompanies, fetchAccountStates } from './redux/company';
//import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';
// import Home from './components/OktaHome';
// import Login from './components/OktaLogin';
// import Protected from './components/OktaProtected'


// const config = {
//   issuer: 'https://dev-120406.oktapreview.com/oauth2/default',
//   redirectUri: 'http://localhost:3000/implicit/callback',
//   clientId: '0oacmp72gaMZcB9nX0h7'
// }


// function onAuthRequired({history}) {
//   history.push('/login');
// }


/* -----------------    COMPONENT     ------------------ */

const Routes = ({ fetchInitialData }) => (
  <Router history={browserHistory}>
    <Route path="/" component={Root} onEnter={fetchInitialData}>
      <IndexRoute component={Home} />
      <Route path="login" component={Login} />
      <Route path="signup" component={Signup} />
      <Route path="add_company" component={addCompany}/>
      <Route path="signup_preferences" componenet={SignupPreferences} />
      <Route path="users/:id" component={UserDetail} />
      <Route path="passcode" component={Passcode} />
    </Route>
    <Route path="*" component={Home} />
  </Router>
);

/* -----------------    CONTAINER     ------------------ */

const mapProps = null;

const mapDispatch = dispatch => ({
  fetchInitialData: () => {
    //dispatch(retrieveLoggedInUser());
    dispatch(fetchEmployeeTitles());
    dispatch(fetchIndustries());
    dispatch(fetchTimezones());
    dispatch(fetchQuantitySKUs());
    dispatch(fetchDataSets());
    dispatch(fetchDCompanies());
    dispatch(fetchAccountStates());
  }
});

export default connect(mapProps, mapDispatch)(Routes);
//<IndexRoute component={Home} />


/*
<Route path="/" component={Root} onEnter={fetchInitialData}>
      <IndexRoute component={Home} />
      <Route path="login" component={Login} />
      <Route path="signup" component={Signup} />
      <Route path="signup_preferences" component={SignupPreferences} />
      <Route path="signup_payment" component={SignupPayment} />
      <Route path="users/:id" component={UserDetail} />
      <Route path="user_settings" component={UserSettings}/>
      <Route path="implicit/callback" component={ImplicitCallback} />
    </Route>
    <Route path="*" component={Home} />
 */

 /*
 const Routes = ({ fetchInitialData }) => (
  <Router history={browserHistory}>
    <Security issuer={config.issuer}
              client_id={config.clientId}
              redirect_uri={config.redirect_uri}
              onAuthRequired={onAuthRequired}>
          <Route path='/' exact={true} component={Home} />
          <SecureRoute path='/protected' component={Protected} />
          <Route path='/login' render={() => <Login baseUrl='https://dev-120406.oktapreview.com' />} />
          <Route path='/implicit/callback' component={ImplicitCallback} />
    
   </Security>
  </Router>
);
  */