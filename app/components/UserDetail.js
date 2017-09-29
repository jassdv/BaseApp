import React from 'react';
import { connect } from 'react-redux';

/* -----------------    COMPONENT     ------------------ */

class UserDetail extends React.Component {
	constructor(props){
		super(props);
	}
	render(){
		const currentUser = this.props.currentUser;
		return(
			<div className="container">
				{
					currentUser ?
					<div>
						<h1>Current user details</h1>
						<h2>Email:{currentUser.email}</h2>
					</div>
					:
					<h1>No user is logged in</h1>
				}
			</div>
		);
	}
}

//const mapState = ({currentUser}) => ({currentUser});
const mapState = state => {
    console.log("user detail state",state);
  return (
    {
        currentUser: state.auth.currentUser
      }

  ) ;
};

const mapDispatch = null;

export default connect(mapState, mapDispatch)(UserDetail);
