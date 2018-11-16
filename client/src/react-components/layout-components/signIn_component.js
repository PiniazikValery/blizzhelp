import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AccountActions } from '../../actions';
import '../../../public/stylesheets/react_component_stylesheets/account/react_signIn.css';

const mapDispatchToProps = dispatch => ({
  handleUserLogin: bindActionCreators(AccountActions.authUser, dispatch),
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

  handleSubmit() {
    fetch('http://localhost:3000/api/user/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.loginEmail,
        password: this.state.loginPassword,
      }),
    })
      .then((response) => {
        this.onUserAuth(response.username);
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
        <form>
          <h4>Sign In</h4>
          <ul id="menuFields">
            <li>
              <input placeholder="Email" id="signInEmail" value={this.state.loginEmail} onChange={this.handleEmailTyping} />
            </li>
            <li>
              <input type="password" placeholder="Passwod" id="signInPassword" value={this.state.loginPassword} onChange={this.handlePasswordTyping} />
            </li>
          </ul>
          <button type="button" onClick={this.handleSubmit}>Sign In</button>
        </form>
      </div>
    );
  }
}

export default connect(undefined, mapDispatchToProps)(SignIn);
