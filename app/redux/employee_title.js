import axios from 'axios';
import {Router, browserHistory } from 'react-router';


/* ------------------    ACTIONS    --------------------- */

const GET_EMPLOYEE_TITLE_LST = 'GET_EMPLOYEE_TITLE_LST';

/* --------------    ACTION CREATORS    ----------------- */
const getEmployeeTitles = employeeTitles =>({ type: GET_EMPLOYEE_TITLE_LST, employeeTitles });

/* ------------------    REDUCER    --------------------- */
 const initialEmployeeTitleState = {
     list: []
 };

 export default function reducer (state=initialEmployeeTitleState, action) {
    switch (action.type) {

      case GET_EMPLOYEE_TITLE_LST:
        return Object.assign({}, state, {list: action.employeeTitles})

      default:
        return state;
  }
}

/* ------------       DISPATCHERS     ------------------ */

export const fetchEmployeeTitles = () => 
    dispatch =>
        axios.get('/api/employee_title')
            .then(res => dispatch(getEmployeeTitles(res.data)))
            .catch(err => console.error('Fetching employee titles unsuccessful', err))