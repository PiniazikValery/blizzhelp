import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Selectors from '../../../selectors';
import SignInComponent from './signIn_component';
import { AccountActions } from '../../../actions';

const mapStateToProps = state => ({
  isUserAuthenticated: Selectors.getUserIsAuthenticated(state),
  authenticatedUserName: Selectors.getNameOfAuthenticatedUser(state),
});

const mapDispatchToProps = dispatch => ({
  handleUserLogout: bindActionCreators(AccountActions.logoutUser, dispatch),
  handleUserLogin: bindActionCreators(AccountActions.authUser, dispatch),
});

class AccountNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = { loginDropDownOpened: false };
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleLogInClick = this.handleLogInClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    fetch('http://localhost:3000/api/user/isauthenticated', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          if (Boolean(result.user_authenticated) === false) {
            this.props.handleUserLogout();
          } else {
            this.props.handleUserLogin(result.username);
          }
        },
      );
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleLogInClick() {
    this.setState(state => ({
      loginDropDownOpened: !state.loginDropDownOpened,
    }));
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({
        loginDropDownOpened: false,
      });
    }
  }

  render() {
    switch (this.props.isUserAuthenticated) {
      case true:
        return (
          <div />
        );
      default:
        return (
          <div ref={this.setWrapperRef}>
            <div role="button" tabIndex="0" id="log_in" onClick={this.handleLogInClick} onKeyDown={this.handleLogInClick}>
              <img src="/images/icons/auth/log_in.png" className="sprite_auth" alt="" />
              <span>Войти</span>
            </div>
            {this.state.loginDropDownOpened ? <SignInComponent /> : undefined}
          </div>
        );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountNavBar);
