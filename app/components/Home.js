import React from 'react';
import { Link } from 'react-router'
import { connect } from 'react-redux';
import { logout } from '../redux/auth';

/* -----------------    COMPONENT     ------------------ */

class Home extends React.Component {
	constructor(props) {
		super(props);
	  }
	render(){
		return (
			<div className="banner text-center text-inverted">
			<h1>Simple App for signup and login</h1>
			
		</div>
		);
	}
}

/* -----------------    CONTAINER     ------------------ */
const mapState = null;

const mapDispatch = { logout: logout };

export default connect(mapState, mapDispatch)(Home);

