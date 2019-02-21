import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Selectors from '../../../selectors';
import SignInComponent from './signIn_component';
import ProfileMenu from './profile_menu_component';
import { AccountActions } from '../../../actions';
import '../../../../public/stylesheets/react_component_stylesheets/account/react_account_navbar.css';

const mapStateToProps = state => ({
  isUserAuthenticated: Selectors.getUserIsAuthenticated(state),
  expirationTime: Selectors.getSessionExpirationTime(state),
});

const mapDispatchToProps = dispatch => ({
  handleUserLogout: bindActionCreators(AccountActions.logoutUser, dispatch),
});

class AccountNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginDropDownOpened: false,
      menuDropDownOpened: false,
    };
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleLogInClick = this.handleLogInClick.bind(this);
    this.handleClickMenu = this.handleClickMenu.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    if (this.props.expirationTime < new Date().getTime()) {
      this.onUserLogOut();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  onUserLogOut() {
    this.props.handleUserLogout();
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleLogInClick() {
    this.setState(state => ({
      loginDropDownOpened: !state.loginDropDownOpened,
      menuDropDownOpened: false,
    }));
  }

  handleClickMenu() {
    this.setState(state => ({
      menuDropDownOpened: !state.menuDropDownOpened,
      loginDropDownOpened: false,
    }));
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({
        loginDropDownOpened: false,
        menuDropDownOpened: false,
      });
    }
  }

  render() {
    switch (this.props.isUserAuthenticated) {
      case true:
        return (
          <div ref={this.setWrapperRef} className="accountNavBar">
            <div role="button" tabIndex="0" id="log_in" onClick={this.handleClickMenu} onKeyDown={this.handleLogInClick}>
              <img src="/images/icons/auth/user_no_avatar.png" className="sprite_auth" alt="" />
              <span>Меню профиля</span>
              {this.state.menuDropDownOpened ? <p className="menu_arrow">&#9650;</p> : undefined}
            </div>
            {this.state.menuDropDownOpened ? <ProfileMenu /> : undefined}
          </div>
        );
      default:
        return (
          <div ref={this.setWrapperRef} className="accountNavBar">
            <div role="button" tabIndex="0" id="log_in" onClick={this.handleLogInClick} onKeyDown={this.handleLogInClick}>
              <img src="/images/icons/auth/log_in.png" className="sprite_auth" alt="" />
              <span>Войти</span>
              {this.state.loginDropDownOpened ? <p className="menu_arrow">&#9650;</p> : undefined}
            </div>
            {this.state.loginDropDownOpened ? <SignInComponent /> : undefined}
          </div>
        );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountNavBar);
