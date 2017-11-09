import React from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import UserDetail from './components/UserDetail';
import Root from './components/Root';
import SignupPreferences from './components/SignupPreferences';
import addCompany from './components/addCompany';
import Logout from './components/Logout';
import { retrieveLoggedInUser } from './redux/auth';
import { fetchIndustries } from './redux/industry';
import { fetchEmployeeTitles } from './redux/employee_title';
import { fetchTimezones } from './redux/timezone';
import { fetchQuantitySKUs } from './redux/quantity_SKU';
import { fetchDataSets } from './redux/data_set';

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
    </Route>
    <Route path="*" component={Home} />
  </Router>
);

/* -----------------    CONTAINER     ------------------ */

const mapProps = null;

const mapDispatch = dispatch => ({
  fetchInitialData: () => {
    dispatch(retrieveLoggedInUser());
    dispatch(fetchEmployeeTitles());
    dispatch(fetchIndustries());
    dispatch(fetchTimezones());
    dispatch(fetchQuantitySKUs());
    dispatch(fetchDataSets());
  }
});

export default connect(mapProps, mapDispatch)(Routes);
//<IndexRoute component={Home} />