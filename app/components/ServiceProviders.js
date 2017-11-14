import React from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { redirectFD } from '../redux/auth'

/* -----------------    COMPONENT     ------------------ */

class ServiceProviders extends React.Component {
    constructor(props) {
      super(props);
      
    }

    render() {
        return(
            <div className="container-fluid">
                <div>
                    <button
                        className="navbar-btn btn btn-default sign-btn"
                        onClick={this.props.redirectFD(this.props.access_token)}>
                        Support
                    </button>
                </div>
                <div>
                    <a href="https://discover.1010data.com/" activeClassName="active" className="sign-field-title" target="_blank">Discover 1010Data</a>
                </div>
                <div>
                    <a href="https://aws.amazon.com/" activeClassName="active" className="sign-field-title" target="_blank">AWS</a>
                </div>
            </div>
        );
    }


}

/* -----------------    CONTAINER     ------------------ */

const mapState = state => 
({
    access_token: state.auth.currentUser.access_token
  });

  const mapDispatch = { redirectFD: redirectFD };
  export default connect(mapState, mapDispatch)(ServiceProviders);