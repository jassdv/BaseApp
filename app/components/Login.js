import React from 'react';
import { connect } from 'react-redux';
import { login,loginAndGoToUser } from '../redux/auth';

/* -----------------    COMPONENT     ------------------ */

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.onLoginSubmit = this.onLoginSubmit.bind(this);
  }

  render() {
    const { message } = this.props;
    const { error_message } = this.props;
    return (
      <div className="container-fluid">
        <h3 className="page-title">Login</h3>
        <div className="buffer local">
          {
            error_message.length > 0 &&
            <h4 id="login_err">{error_message}</h4>
          }
          <form className="col-sm-6" onSubmit={this.onLoginSubmit}>
            <div className="form-group">
              <label className="sign-field-title">email</label>
              <input
                name="email"
                type="email"
                className="form-control sign-input"
                required
              />
            </div>
            <div className="form-group">
                <label className="sign-field-title">password</label>
                <input
                  name="password"
                  type="password"
                  className="form-control sign-input"
                  required
                />
            </div>
            <button type="submit" className="btn btn-block btn-primary sign-input sign-btn">{message}</button>
          </form>
        </div>
      </div>
    );
  }

  onLoginSubmit(event) {
    event.preventDefault();
    const credentials = {
      email: event.target.email.value,
      password: event.target.password.value
    };
    this.props.login(credentials);
    console.log('go back to login page');
  }
}

/* -----------------    CONTAINER     ------------------ */

//const mapState = () => ({ message: 'Log in' });

const mapState = state => {
  console.log("login state",state);
return (
  {
    message: 'Log in',
    error_message: state.auth.login_error
  });
};

const mapDispatch = { login: login};
// // equivalent to:
// const mapDispatch = (dispatch) => {
//   return {
//     login: function (credentials) {
//       dispatch(loginAndGoToUser(credentials));
//     }
//   };
// };

export default connect(mapState, mapDispatch)(Login);
