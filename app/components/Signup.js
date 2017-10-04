import React from 'react';
import { connect } from 'react-redux';
import { signupAndGoToUser,signupAndGoToUSetPreferences } from '../redux/auth';


/* -----------------    COMPONENT     ------------------ */

class Signup extends React.Component {

  constructor(props) {
    super(props);
    this.onSignupSubmit = this.onSignupSubmit.bind(this);
  }

  render(){
		const { message } = this.props;
		const { industries } = this.props;
		const { employeeTitles } = this.props;
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
					<input 
						name="companyName"
						type="name"
						className="form-control sign-input"
					/>
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
				<div className="form-group">
					<label className="sign-field-title">Industry</label>
					<select name="industries" className="form-control sign-input">
						{
							industries && industries.map((industry) => (
								<option key={industry.id}>{industry.id} {industry.title}</option>
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

		let industryId = (event.target.industries.value).split(' ');
		industryId = parseInt(industryId[0]);


    const credentials = {
			firstName: event.target.firstName.value,
			lastName: event.target.lastName.value,
      email: event.target.email.value,
			password: event.target.password.value,
			company:	event.target.companyName.value,
			employeeTitle: employeeTitleId,
			industry:	industryId
		};
    this.props.signup(credentials);
  }

}


/* -----------------    CONTAINER     ------------------ */

const mapState = (state) => ({
	 message: 'Next',
	 industries: state.industry.list,
	 employeeTitles: state.employee_title.list
	});

const mapDispatch = { signup: signupAndGoToUSetPreferences };


export default connect(mapState, mapDispatch)(Signup);





/*
<input 
						name="industry"
						type="name"
						className="form-control sign-input"
					/>
 */