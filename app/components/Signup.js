import React from 'react';
import { connect } from 'react-redux';
import { hashHistory,browserHistory } from 'react-router';
import { signupAndGoToUser,signupAndGoToUSetPreferences, signup, enrollEmailFactor, activateEmail, activateUser} from '../redux/auth';


/* -----------------    COMPONENT     ------------------ */

class Signup extends React.Component {

  constructor(props) {
    super(props);
		this.onSignupSubmit = this.onSignupSubmit.bind(this);
		//this.checkAndDisplayNewCompanyForm = this.checkAndDisplayNewCompanyForm.bind(this);
  }

  render(){
		const { message } = this.props;
		const { employeeTitles } = this.props;
		const { companies } = this.props;
  	return(
  		<div className="container-fluid">
				<h3 className="page-title">Sign Up</h3>
  		 <form className="col-sm-6" onSubmit={this.onSignupSubmit}>
				<div className="form-group">
					<label className="sign-field-title">First Name</label>
					<input 
						name="firstName"
						type="name"
						className="form-control sign-input"
					/>
  		  </div>
				<div className="form-group">
					<label className="sign-field-title">Last Name</label>
					<input 
						name="lastName"
						type="name"
						className="form-control sign-input"
					/>
  		  </div>
  		  <div className="form-group">
  		   <label className="sign-field-title">Email</label>
  		   <input 
  		    name="email"
  		    type="email"
  		    className="form-control sign-input"
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
					<select name="company" className="form-control sign-input">
						{
							companies && companies.map((name) => (
								<option key={name.id}>{name.id} {name.name}</option>
							))
						}
					</select>
				</div>
				<div className="form-group">
					<label className="sign-field-title">Employee Title</label>
					<select name="employeeTitle" className="form-control sign-input">
						{
							employeeTitles && employeeTitles.map((title) => (
								<option key={title.id}>{title.id} {title.title}</option>
							))
						}
					</select>
  		  </div>
  		  <button type="submit" className="btn btn-block btn-primary sign-input sign-btn">{message}</button>
  		 </form>
  		</div>
  	);
	}
	/*reading all input information from the form and send them via
	"signup" to the data base
	*/
  onSignupSubmit(event) {
		event.preventDefault();
		//getting the employee title id and the industry id
		let employeeTitleId = (event.target.employeeTitle.value).split(' ');
		employeeTitleId = parseInt(employeeTitleId[0]);


		//getting the company id
		let companyvalue = (event.target.company.value).split(' ');
		let companyId = parseInt(companyvalue[0]);
		let companyName = companyvalue[1];

		//finding the company's account state
		let companies = this.props.companies;
		let company = companies.filter((element) => {
			return (event.target.company.value.includes(element.name));
			}
		);
		
		let accountState = company[0].account_state
    	const credentials = {
			firstName: event.target.firstName.value,
			lastName: event.target.lastName.value,
      		email: event.target.email.value,
			password: event.target.password.value,
			company_id:	companyId,
			company_name: companyName,
			employeeTitle: employeeTitleId,
			accoun_state: accountState,
			admin: true
		};
		let user_id = this.props.signup(credentials);
		// let oktaUserInfo = {
		// 	email: credentials.email,
		// 	user_id: user_id

		// };
		//debugger;
		//this.props.enrollEmailFactor(oktaUserInfo);
	
	}
	
	/*
	the following function was made to display "add company"
	form that was supposed to be displayed once the user chooses 
	"New company" in the company field. 
	currently I took it out and I will add it to 
	"company settings"
	 */
	// checkAndDisplayNewCompanyForm(event){
	// 	const { industries } = this.props;
	// 	//let name = event.target.value.split(' ');
	// 	let spaceIndex = event.target.value.indexOf(' ');
	// 	let name = event.target.value.slice(spaceIndex+1);
	// 	//debugger;
	// 	//name = name[1];
	// 	console.log('about to render add company form');
	// 	if(name === "New Company"){
	// 		browserHistory.push('add_company');

	// 	}
	// 	console.log('got change###@@##@@',event.target.value);

	// }

}


/* -----------------    CONTAINER     ------------------ */

const mapState = (state) => ({
	 message: 'Next',
	 employeeTitles: state.employee_title.list,
	 companies: state.company.list
	});

//orginal: const mapDispatch = { signup: signupAndGoToUSetPreferences };
const mapDispatch = { 
	signup: signup,
	enrollEmailFactor: enrollEmailFactor,
	activateEmail: activateEmail,
	activateUser: activateUser
};

export default connect(mapState, mapDispatch)(Signup);





