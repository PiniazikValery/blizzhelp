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
    this.handleKeyPress = this.handleKeyPress.bind(this);
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

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }

  render() {
    return (
      <div id="signInMenu">
        <form>
          <h4>Форма входа</h4>
          <ul id="menuFields">
            <li>
              <input placeholder="Email" id="signInEmail" value={this.state.loginEmail} onChange={this.handleEmailTyping} onKeyPress={this.handleKeyPress} />
            </li>
            <li>
              <input type="password" placeholder="Password" id="signInPassword" value={this.state.loginPassword} onChange={this.handlePasswordTyping} onKeyPress={this.handleKeyPress} />
            </li>
          </ul>
          <button className="clickable" type="button" onClick={this.handleSubmit}>Войти</button>
          <div className="strike">
            <span>or</span>
          </div>
          <button onClick={() => { window.location.href = '/auth/registration'; }} className="register clickable" type="button">Зарегистрироваться</button>
        </form>
      </div>
    );
  }
}

export default connect(undefined, mapDispatchToProps)(SignIn);
