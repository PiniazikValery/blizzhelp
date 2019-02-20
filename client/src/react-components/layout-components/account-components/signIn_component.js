import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AccountActions, SessionActions } from '../../../actions';
import handleErrors from '../../../../middlewares/error_handler_middleware';
import notificators from '../notification-components/notificators';
import '../../../../public/stylesheets/react_component_stylesheets/account/react_signIn.css';
import '../../../../public/stylesheets/react_component_stylesheets/account/text_with_line.css';

const mapDispatchToProps = dispatch => ({
  handleUserLogin: bindActionCreators(AccountActions.authUser, dispatch),
  handleUpdateSessionExpirationTime: bindActionCreators(SessionActions.setSessionExpirationTime, dispatch),
});

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginEmail: '',
      loginPassword: '',
    };
    this.handleEmailTyping = this.handleEmailTyping.bind(this);
    this.handlePasswordTyping = this.handlePasswordTyping.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onUserAuth(username) {
    this.props.handleUserLogin(username);
  }

  onUpdateSessionExpirationTime(expirationTime) {
    this.props.handleUpdateSessionExpirationTime(expirationTime);
  }

  handleSubmit() {
    fetch('/api/user/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.loginEmail,
        password: this.state.loginPassword,
      }),
    })
      .then(handleErrors)
      .then(res => res.json())
      .then((result) => {
        this.onUserAuth({
          username: result.username,
          user_role: result.user_role,
        });
        this.onUpdateSessionExpirationTime(result.expiration_time);
        notificators.mainNotificator.showSuccess(`Welcome back ${result.username}`);
      })
      .catch((error) => {
        if (error.message === '500') {
          notificators.mainNotificator.showError('Wrong email or password enterd');
        }
      });
  }

  handleEmailTyping(event) {
    this.setState({
      loginEmail: event.target.value,
    });
  }

  handlePasswordTyping(event) {
    this.setState({
      loginPassword: event.target.value,
    });
  }

  render() {
    return (
      <div id="signInMenu">
        <p className="log_in_arrow">&#9650;</p>
        <form>
          <h4>Sign In</h4>
          <ul id="menuFields">
            <li>
              <input placeholder="Email" id="signInEmail" value={this.state.loginEmail} onChange={this.handleEmailTyping} />
            </li>
            <li>
              <input type="password" placeholder="Password" id="signInPassword" value={this.state.loginPassword} onChange={this.handlePasswordTyping} />
            </li>
          </ul>
          <button type="button" onClick={this.handleSubmit}>Sign In</button>
          <div className="strike">
            <span>or</span>
          </div>
          <button onClick={() => { window.location.href = '/auth/registration'; }} className="register" type="button">Register</button>
        </form>
      </div>
    );
  }
}

export default connect(undefined, mapDispatchToProps)(SignIn);
