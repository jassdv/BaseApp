import React from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { logout } from '../redux/auth';
import  { NavDropdown, MenuItem } from 'react-bootstrap'
//import { withAuth } from '@okta/okta-react';
//import {OktaAuth} from '@okta/okta-auth-js';

/* -----------------    COMPONENT     ------------------ */


// export default withAuth(class Navbar extends React.Component {
//     constructor(props) {
//       super(props);
//       console.log('PROPS', this.props)
//       this.state = { authenticated: null };
//       this.checkAuthentication = this.checkAuthentication.bind(this);
//       this.checkAuthentication();
//     }
  
//     async checkAuthentication() {
//       const authenticated = await this.props.auth.isAuthenticated();
//       if (authenticated !== this.state.authenticated) {
//         this.setState({ authenticated });
//       }
//     }
  
//     componentDidUpdate() {
//       this.checkAuthentication();
//     }
  
//     render() {
//       console.log("this in Navbar", this);
//         return (
//             <nav id="discover-navbar" className="navbar navbar-light">
//                 <a className="navbar-brand" href="/">
//                     <img id="logo" src="/images/1010data_Logo_2016.png" width="200" className="d-inline-block align-top" alt=""/>
//                 </a>
//                  <div className="collapse navbar-collapse">
//                 { 
//                   <button onClick={this.props.auth.logout}>Logout</button> 
                    
//                 }
//                 </div>
//              </nav>

//         );
//     }
//   });
  
/*

                    this.state.authenticated ? 
                         <button onClick={this.props.auth.logout}>Logout</button> 
                        : 
                        <button onClick={this.props.auth.login}>Login</button>
*/
class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.renderLoginSignup = this.renderLoginSignup.bind(this);
    this.renderLogoutAndSettings = this.renderLogoutAndSettings.bind(this);
    this.settingsSelect = this.settingsSelect.bind(this);
  }
//<nav id="discover-navbar" className="navbar navbar-light navbar-brand">
  render() {
    return (
        <nav id="discover-navbar" className="navbar navbar-light">
         <a className="navbar-brand" href="/">
             <img id="logo" src="/images/1010data_Logo_2016.png" width="200" className="d-inline-block align-top" alt=""/>
        </a>
        <div className="collapse navbar-collapse">
        { 
            this.props.currentUser.user_id ? this.renderLogoutAndSettings() : this.renderLoginSignup()
            
        }
        </div>
       </nav>
    );
  }

  renderLoginSignup() {
    return (
      <ul id="nav-sign-buttons" className="nav navbar-nav navbar-right">
        <li>
         <Link to="/signup" activeClassName="active" className="sign-field-title">signup</Link>
        </li>
        <li>
          <Link to="/login" activeClassName="active" className="sign-field-title">login</Link>
        </li>
      </ul>
    );
  }

  renderLogoutAndSettings() {
    const name = this.props.currentUser.fullName || this.props.currentUser.email;
    return (
      <ul className="nav navbar-nav navbar-right">
          {
            this.props.currentUser.admin ? 
            <NavDropdown title="Settings" id="nav-dropdown" onSelect={this.settingsSelect}>
                <MenuItem name="user" eventKey="1">User</MenuItem>
                <MenuItem name="companies" eventKey="2">Companies</MenuItem>
            </NavDropdown>
            :
            null
        }
        <li>
        <button
          className="navbar-btn btn btn-default sign-btn"
          onClick={this.props.logout}>
          logout {name}
        </button>
        </li>
     </ul>
    );
  }

  settingsSelect(eventKey) {
      //event.preventDefault();
      console.log('got to setting select event key',eventKey);
      switch(eventKey){
          case '1':
             return  browserHistory.push('/user_settings');
             break;
        case '2':
            return browserHistory.push('/companies_settings');
            break;
        default:
            break;
        }
    }
}

/* -----------------    CONTAINER     ------------------ */


const mapState = state => {
  return (
    {
        currentUser: state.auth.currentUser
      }

  ) ;
};

// const mapDispatch = dispatch => ({
//   logout: () => {
//     dispatch(logOutUser());
//     // browserHistory.push('/'); // removed to demo logout instant re-render
//   }
// });

const mapDispatch = { logout: logout };

export default connect(mapState, mapDispatch)(Navbar);

// (this.props.currentUser && this.props.currentUser.admin) ? this.renderSettings() : null


