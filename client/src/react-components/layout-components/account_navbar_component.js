import React, { Component } from 'react';
import { connect } from 'react-redux';
import Selectors from '../../selectors';

const mapStateToProps = state => ({
  isUserAuthenticated: Selectors.getUserIsAuthenticated(state),
  authenticatedUserName: Selectors.getNameOfAuthenticatedUser(state),
});

class AccountNavBar extends Component {
  render() {
    switch (this.props.isUserAuthenticated) {
      case true:
        return (
          <div />
        );
      default:
        return (
          <div id="log_in">
            <a href="/">
              <img id="sprite_log_in" className="sprite_auth" alt="" />
              <span>Войти</span>
            </a>
          </div>
        );
    }
  }
}

export default connect(mapStateToProps)(AccountNavBar);
