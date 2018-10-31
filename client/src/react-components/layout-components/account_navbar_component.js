import React, { Component } from 'react';
import { connect } from 'react-redux';
import Selectors from '../../selectors';

const mapStateToProps = state => ({
  isUserAuthenticated: Selectors.getUserIsAuthenticated(state),
  authenticatedUserName: Selectors.getNameOfAuthenticatedUser(state),
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
              <img id="sprite_log_in" className="sprite_auth" alt="" />
              <span>Войти</span>
            </div>
            <div>
              {this.state.loginDropDownOpened ? 'opened' : 'closed'}
            </div>
          </div>
        );
    }
  }
}

export default connect(mapStateToProps)(AccountNavBar);
