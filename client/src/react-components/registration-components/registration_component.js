import React, { Component } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import handleErrors from '../../../middlewares/error_handler_middleware';
import notificators from '../layout-components/notification-components/notificators';
import '../../../public/stylesheets/react_component_stylesheets/account/react_registration_form.css';

class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      rewrited_password: '',
      password: '',
      auth_code: '',
      wrong_email: false,
      wrong_username: false,
      wrong_rewrited_password: false,
      wrong_password: false,
      wrong_auth_code: false,
    };
    this._reCaptchaRef = React.createRef();
    this.handleEmailTyping = this.handleEmailTyping.bind(this);
    this.handlePasswordTyping = this.handlePasswordTyping.bind(this);
    this.handlePasswordRewriting = this.handlePasswordRewriting.bind(this);
    this.handleUsernameTyping = this.handleUsernameTyping.bind(this);
    this.handleAuthCodeTyping = this.handleAuthCodeTyping.bind(this);
    this.onClickGenerateCode = this.onClickGenerateCode.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.removeAllWarnings = this.removeAllWarnings.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(response) {
    this._reCaptchaRef.current.reset();
    fetch('/api/user', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        username: this.state.username,
        password: this.state.password,
        auth_code: this.state.auth_code,
        'g-recaptcha-response': response,
      }),
    })
      .then(handleErrors)
      .then(res => res.json())
      .then((result) => {
        notificators.mainNotificator.showSuccess(result.message);
        window.location.href = '/';
      })
      .catch((error) => {
        if (error.message === '501') {
          notificators.mainNotificator.showError('Error occure while create user');
        }
      });
  }

  onSubmit = () => {
    this.removeAllWarnings();
    this.validateFields((validationError) => {
      if (validationError) {
        notificators.mainNotificator.showWarning(validationError.message);
      } else {
        this._reCaptchaRef.current.execute();
      }
    });
  };

  onClickGenerateCode = () => {
    if (this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      fetch('/api/verifyUser', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.email,
        }),
      })
        .then(handleErrors)
        .then(res => res.json())
        .then((result) => {
          notificators.mainNotificator.showSuccess(result.message);
        })
        .catch((error) => {
          if (error.message === '501') {
            notificators.mainNotificator.showError('Verification code already generated for this email, please wait 1 hour to get new');
          }
        });
    } else {
      notificators.mainNotificator.showWarning('Invalid email');
    }
  }

  validateFields(callback) {
    if (!this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      this.setState({
        wrong_email: true,
      });
      return callback(new Error('Invalid email'));
    }
    if (this.state.username === '') {
      this.setState({
        wrong_username: true,
      });
      return callback(new Error('Empty username field'));
    }
    if (this.state.password !== this.state.rewrited_password) {
      this.setState({
        wrong_password: true,
        wrong_rewrited_password: true,
      });
      return callback(new Error('Passwords dosen`t matchs'));
    }
    if (this.state.password === '') {
      this.setState({
        wrong_password: true,
      });
      return callback(new Error('Empty password field'));
    }
    if (this.state.password.length <= 8) {
      this.setState({
        wrong_password: true,
      });
      return callback(new Error('Password lenght lower then 8 sumbols'));
    }
    if (this.state.auth_code === '') {
      this.setState({
        wrong_auth_code: true,
      });
      return callback(new Error('Empty code field'));
    }
    return callback();
  }

  handleEmailTyping(event) {
    this.setState({
      email: event.target.value,
    });
  }

  handlePasswordTyping(event) {
    this.setState({
      password: event.target.value,
    });
  }

  handlePasswordRewriting(event) {
    this.setState({
      rewrited_password: event.target.value,
    });
  }

  handleUsernameTyping(event) {
    this.setState({
      username: event.target.value,
    });
  }

  handleAuthCodeTyping(event) {
    this.setState({
      auth_code: event.target.value,
    });
  }

  removeAllWarnings() {
    this.setState({
      wrong_email: false,
      wrong_username: false,
      wrong_password: false,
      wrong_rewrited_password: false,
      wrong_auth_code: false,
    });
  }

  render() {
    return (
      <div id="registrationMenu">
        <form>
          <ReCAPTCHA
            size="invisible"
            ref={this._reCaptchaRef}
            sitekey="6Lcq7pEUAAAAAJjhYwvoYb4FFuVy2NoXb-DJI1-x"
            onChange={this.onChange}
          />
          <h4>Registration from</h4>
          <ul id="menuFields">
            <li>
              <input className={`longField ${this.state.wrong_email ? 'wrongEntered' : ''}`} placeholder="Email" id="registrationEmail" value={this.state.email} onChange={this.handleEmailTyping} />
            </li>
            <li>
              <input className={`longField ${this.state.wrong_username ? 'wrongEntered' : ''}`} placeholder="Username" id="registrationUsername" value={this.state.username} onChange={this.handleUsernameTyping} />
            </li>
            <li>
              <input className={`longField ${this.state.wrong_password ? 'wrongEntered' : ''}`} type="password" placeholder="Password" id="registrationPassword" value={this.state.password} onChange={this.handlePasswordTyping} />
            </li>
            <li>
              <input className={`longField ${this.state.wrong_rewrited_password ? 'wrongEntered' : ''}`} type="password" placeholder="Re-enter password" id="registrationRewritedPassword" value={this.state.rewrited_password} onChange={this.handlePasswordRewriting} />
            </li>
            <li>
              <button id="GenerateCodeButton" type="button" onClick={this.onClickGenerateCode}>Send code</button>
              <input className={`shortField ${this.state.wrong_auth_code ? 'wrongEntered' : ''}`} placeholder="Code" id="registrationAuthCode" value={this.state.auth_code} onChange={this.handleAuthCodeTyping} />
            </li>
          </ul>
          <button id="SubmitButton" type="button" onClick={this.onSubmit}>Create user</button>
        </form>
      </div>
    );
  }
}

export default Registration;
