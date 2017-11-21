import React from 'react';
import { connect } from 'react-redux';
import { hashHistory,browserHistory } from 'react-router';
import { updateUserAccount, setCompany } from '../redux/auth';

/* -----------------    COMPONENT     ------------------ */
/*
UserSettings:
This is the "account setting form"
*/
class UserSettings extends React.Component {
    
      constructor(props) {
        super(props);
            this.onUpdateSubmit = this.onUpdateSubmit.bind(this);
            this.onChangeCompany = this.onChangeCompany.bind(this);
            this.findCompanyId = this.findCompanyId.bind(this);
            this.findTimeZoneId = this.findTimeZoneId.bind(this);
            this.findEmployeeTitleId = this.findEmployeeTitleId.bind(this);
            this.findQuantitySKUId = this.findQuantitySKUId.bind(this);
            this.getAccountStates = this.getAccountStates.bind(this);
            this.getCompoanyAccountState = this.getCompoanyAccountState.bind(this);
      }

    
      render(){
            const { message } = this.props;
            const { employeeTitles } = this.props;
            const { companies } = this.props;
            const { time_zones } = this.props;
            const { quantity_SKUs } = this.props;
            const { data_sets } = this.props;
            const { user } = this.props;
            //const { account_states } = this.props;
            let keyId = 1;
            let curCompanyAccountState = this.getCompoanyAccountState(user.company_id);
            const account_states = this.getAccountStates(curCompanyAccountState);
            console.log('in usersettings render');

          return(
              <div className="container-fluid">
                <h3 className="page-title">User Settings</h3>
                <form className="col-sm-6" onSubmit={this.onUpdateSubmit}>
                    <div className="form-group">
                        <label className="sign-field-title">First Name</label>
                        <input 
                            name="firstName"
                            type="name"
                            className="form-control sign-input"
                            defaultValue={user.firstName}
                        />
                </div>
                    <div className="form-group">
                        <label className="sign-field-title">Last Name</label>
                        <input 
                            name="lastName"
                            type="name"
                            className="form-control sign-input"
                            defaultValue={user.lastName}
                        />
                </div>
                <div className="form-group">
                 <label className="sign-field-title">Email</label>
                 <input 
                  name="email"
                  type="email"
                  className="form-control sign-input"
                  defaultValue={user.email}
                 />
                </div>
                <div className="form-group">
                 <label className="sign-field-title">Password</label>
                 <input 
                  name="password"
                  type="password"
                  className="form-control sign-input"
                 />
                </div>
                    <div className="form-group">
                        <label className="sign-field-title">Company Name</label>
                        <select defaultValue={user.company_id} name="company" className="form-control sign-input" onChange={this.onChangeCompany}>
                            {
                                companies && companies.map((name) => (
                                    <option key={name.id} value={name.id } >{name.name}</option> 
                                ))
                            }
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="sign-field-title">Employee Title</label>
                        <select name="employeeTitle" className="form-control sign-input" defaultValue={user.employee_title_id}>
                            {
                                employeeTitles && employeeTitles.map((title) => (
                                    <option key={title.id} value={title.id}>{title.title}</option> 
                                ))
                            }
                        </select>
                </div>
                <div className="form-group">
                    <label className="sign-field-title">Accont State</label>
                    <select name="accountState" className="form-control sign-input">
                            {   
                                account_states && account_states.map((state) => (
                                    <option key={keyId++}>{state}</option>
                                ))
                            }
                    </select>
                </div>
                <div className="form-group">
                    <label className="sign-field-title">Time Zone</label>
                    <select name="timeZone" className="form-control sign-input" defaultValue={user.time_zone_id}>
                    {
                        time_zones && time_zones.map((timeZone) => (
                            <option key={timeZone.id} value={timeZone.id}>{timeZone.time_zone}</option>
                        ))
                    }
                    </select>
  		        </div>
                  <div className="form-group">
                        <label className="sign-field-title">Quantity and SKU</label>
                        <select name="quantitySKU" className="form-control sign-input" defaultValue={user.quantity__s_k_u_id}>
                        {
                            quantity_SKUs && quantity_SKUs.map((quantitySKU) => (
                                <option key={quantitySKU.id} value={quantitySKU.id}>{quantitySKU.range_value}</option>
                            ))
                        }
                        </select>
                 </div>
                 <div className="form-group">
                    <label className="sign-field-title">Data Set</label>
                        <fieldset>
                        {
                            data_sets && data_sets.map((dataset)=>(
                                <span key={dataset.id}>
                                    {
                                        user.data_sets && (user.data_sets.filter((element)=>(element.id === dataset.id)).length > 0) ?
                                        <input type="checkbox" id="dataset" name="data_set" value={dataset.dataset} checked/>
                                        :
                                        <input type="checkbox" id="dataset" name="data_set" value={dataset.dataset}/>
                                    }
                                    <label id="dataset-label">{` ${dataset.dataset}`}</label>
                                 </span>
                            ))

                        }
                        </fieldset>
                </div>
                <div className="form-group">
                    <label className="sign-field-title">Amount</label>
                    <input 
                        name="paymentAmount"
                        type="numbber"
                        className="form-control sign-input"
                        value={user.payment_amount}
                    />
                </div>
                <button type="submit" className="btn btn-block btn-primary sign-input sign-btn">{message}</button>
               </form>
              </div>
          );
        }

        /* ------------------- Event handling functions ------------------- */
        
        /*
        when a user changes his/hers company choice
        the account_state options should be changed according
        to the following logic:
        company: trial --> user: trial,inactive,deleted
        company: inactive --> user: inactive, deleted
        company: active --> user: active,inactive,deleted
        company: deleted --> user: deleted
         */
        onChangeCompany(event){
            return this.props.setUserCompoanyId(event.target.value);
         
        }

        /*
        reads all input values from the settings form
        dispaches updateUserAccunt
         */
        onUpdateSubmit(event){
            let firstName=event.target.firstName.value;
            let lastName=event.target.lastName.value;
            let email=event.target.email.value;
            let companyId=parseInt(event.target.company.value);
            let employeeTitleId=parseInt(event.target.employeeTitle.value);
            let account_state=event.target.accountState.value;
            let timeZoneId=parseInt(event.target.timeZone.value);
            let quantitySKUId=parseInt(event.target.quantitySKU.value);
            let datasetIds=[];
            let payment=event.target.paymentAmount.value;
            let checkboxes = event.target.data_set;
            console.log('data sets',this.props.data_sets);
            //geeting the data sets ids from the checked data sets
            for(let i=0;i<checkboxes.length;i++){
                if(checkboxes[i].checked){
                    datasetIds.push(this.props.data_sets[i].id);
    
    
                }
    
            }
            const userUpdatedInfo = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                companyId: companyId,
                employee_title_id: employeeTitleId,
                account_state: account_state,
                time_zone_id: timeZoneId,
                quantity__s_k_u_id: quantitySKUId,
                data_sets: datasetIds,
                payment_amount: payment
            };
            this.props.update(this.props.user.id,userUpdatedInfo);
        }

        //functions to find fields IDs from an input field string
        findTimeZoneId(timezoneStr){
            let timezones = this.props.time_zones;
            let timezone = timezones.filter((element)=>{
                console.log('element', element);
                return element['time_zone'].includes(timezoneStr);
    
            });
            if(timezone.length > 0){
                let id = timezone[0]['id'];
                return id;
    
            }
        }
        findCompanyId(companyStr){
            let companies = this.props.companies;
            let company = companies.filter((element)=>{
                console.log('element', element);
                return element['name'].includes(companyStr);
    
            });
            if(company.length > 0){
                let id = company[0]['id'];
                return id;
    
            }
        }
        findEmployeeTitleId(employeeTitleStr){
            let employeeTitles = this.props.employeeTitles;
            let employeeTitle = employeeTitles.filter((element)=>{
                console.log('element', element);
                return element['title'].includes(employeeTitleStr);
    
            });
            if(employeeTitle.length > 0){
                let id = employeeTitle[0]['id'];
                return id;
    
            }
        }

        findQuantitySKUId(qSKUStr){
            let qSKUs = this.props.quantity_SKUs;
            let qSKU = qSKUs.filter((element)=>{
                console.log('element', element);
                return element['range_value'].includes(qSKUStr);
    
            });
            if(qSKU.length > 0){
                let id = qSKU[0]['id'];
                return id;
    
            }
    
        }

        //gets a company's account state and returns an array of 
        //available account sstates for the user according to the following logic:
        //company: trial --> user: trial,inactive,deleted
        //company: inactive --> user: inactive, deleted
        //company: active --> user: active,inactive,deleted
        //company: deleted --> user: deleted
        getAccountStates(comanyAccountState){
            let userAccountStates=[];
            switch(comanyAccountState){
                case 'trial':
                    userAccountStates.push('trial');
                    userAccountStates.push('inactive');
                    userAccountStates.push('deleted');
                    break;
                case 'inactive':
                    userAccountStates.push('inactive');
                    userAccountStates.push('deleted');
                    break;
                case 'active':
                    userAccountStates.push('active');
                    userAccountStates.push('inactive');
                    userAccountStates.push('deleted');
                    break;
                case 'deleted':
                    userAccountStates.push('deleted');
                    break;
                default:
                    break;


            }
            return userAccountStates;

        }
        //finds a company according ti the input id
        //and returns its account state
        getCompoanyAccountState(companyId) {
            let companies = this.props.companies;
            let company = companies.filter((element)=>{
                return element.id === companyId;

            });
            //if found the company - returns its account state
            if(company.length > 0){
                return company[0].account_state;

            }

        }
    }

    /* -----------------    CONTAINER     ------------------ */

const mapState = (state) => ({
    message: 'Update',
    employeeTitles: state.employee_title.list,
    companies: state.company.list,
    time_zones: state.time_zone.list,
    quantity_SKUs: state.quantity_SKU.list,
    data_sets: state.data_set.list,
    user: state.auth.currentUser,
    account_states: state.company.accountStates,
    company_id: state.auth.currentUser.company_id     
 });

const mapDispatch = { 
    update: updateUserAccount,
    setUserCompoanyId: setCompany
 }; 


export default connect(mapState, mapDispatch)(UserSettings);