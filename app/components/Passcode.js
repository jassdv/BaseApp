import React from 'react';
import { connect } from 'react-redux';
import { hashHistory,browserHistory } from 'react-router';
import { activateEmail, activateUser} from '../redux/auth';

/* -----------------    COMPONENT     ------------------ */
/*
passcode form collects the passcode the user got in his email from Okta
Once the user submkts the passcode, Discover e-commerce activates the "email"
with that passcode (activateEmail) and if succeeded, Doscover e-commerce activates the user
(activateUser)
 */
class Passcode extends React.Component{
    constructor(props) {
        super(props);
            this.onSsubmitPasscode = this.onSsubmitPasscode.bind(this);
            
      }
    render(){
        const { message } = this.props;

        return(
            <div className="container-fluid">
                <h3 className="page-title">Passcode</h3>
                <form className="col-sm-6" onSubmit={this.onSsubmitPasscode}>
                    <div className="form-group">
					    <label className="sign-field-title">Please enter the passcode that was sent to your email</label>
					    <input 
                            name="passcode"
                            type="name"
                            className="form-control sign-input"
					    />
  		            </div>
                    <button type="submit" className="btn btn-block btn-primary sign-input sign-btn">{message}</button>
                </form>
            </div>

        );
    }

    
    /*
    reads the passcode
    calls: activateEmail with the passcode
    if success - calls activateUser
    if not - TBD
    */
      onSsubmitPasscode(event){
        event.preventDefault();
        let oktaInfo={
		    user_id: this.props.user_id,
		    factor_id: this.props.email_factor_id,
		    passCode: event.target.passcode
		}
        if(this.props.activateEmail(oktaInfo)){
            this.props.activateUser(oktaInfo);

        }
        
        


      }


}

/* -----------------    CONTAINER     ------------------ */

const mapState = (state) => ({
    message: 'Submit passcode',
    user_id: state.auth.currentUser.user_id,
    email_factor_id: state.auth.currentUser.email_factor_id
   });

//orginal: const mapDispatch = { signup: signupAndGoToUSetPreferences };
const mapDispatch = { 
   activateEmail: activateEmail,
   activateUser: activateUser
};

export default connect(mapState, mapDispatch)(Passcode);
