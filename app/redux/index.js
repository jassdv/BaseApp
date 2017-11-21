/*
combineReducers is an object from redux 
that is used to combine all the different states into one state 
in the webapp store.
auth, industry, employee_title, timezone, quantity_SKU, data_set, company
they all have their "initialstate" and a "reducer" function
Here we combine them all together

*/
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    auth: require('./auth').default,
    industry: require('./industry').default,
    employee_title: require('./employee_title').default,
    time_zone: require('./timezone').default,
    quantity_SKU: require('./quantity_SKU').default,
    data_set: require('./data_set').default,
    company: require('./company').default
  })
  
  export default rootReducer