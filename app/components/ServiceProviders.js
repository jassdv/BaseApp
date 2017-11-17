import React from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { redirectFD } from '../redux/auth'

/* -----------------    COMPONENT     ------------------ */

class ServiceProviders extends React.Component {
    constructor(props) {
      super(props);
      this.onSupport = this.onSupport.bind(this);
      
    }

    render() {
        return(
            <div className="container-fluid">
                <div>
                <a href="#" onClick={this.onSupport} className="sign-field-title" target="_blank">Support</a>
                </div>
                <div>
                    <a href="https://discover.1010data.com/" className="sign-field-title" target="_blank">Discover 1010Data</a>
                </div>
                <div>
                    <a href="https://aws.amazon.com/" className="sign-field-title" target="_blank">AWS</a>
                </div>
            </div>
        );
    }
    onSupport(event){
        event.preventDefault();
        this.props.redirectFD(this.props.access_token);


    }



}

/*
<button
                        className="navbar-btn btn btn-default sign-btn"
                        onClick={this.onSupport}>
                        Support
                </button>

<a href={this.props.redirectFD(this.props.access_token)} className="sign-field-title" target="_blank">Support</a>
 */
/* -----------------    CONTAINER     ------------------ */

const mapState = state => 
({
    access_token: state.auth.currentUser.access_token
  });

  const mapDispatch = { redirectFD: redirectFD };
  export default connect(mapState, mapDispatch)(ServiceProviders);