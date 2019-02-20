import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AccountActions } from '../../actions';
import Selectors from '../../selectors';
import notificators from '../layout-components/notification-components/notificators';

const mapStateToProps = state => ({
  isUserAuthenticated: Selectors.getUserIsAuthenticated(state),
  authenticatedUserName: Selectors.getNameOfAuthenticatedUser(state),
  expirationTime: Selectors.getSessionExpirationTime(state),
});

const mapDispatchToProps = dispatch => ({
  handleUserLogout: bindActionCreators(AccountActions.logoutUser, dispatch),
});

class UnauthorizedHandler extends Component {
  constructor(props) {
    super(props);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  componentDidMount() {
    fetch('/api/user/isauthenticated', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then((result) => {
        if (result.user_authenticated !== 'true' && this.props.isUserAuthenticated) {
          this.handleLogOut();
          notificators.mainNotificator.showWarning('Your session has been closed');
        }
      });
  }

  handleLogOut() {
    this.props.handleUserLogout();
  }

  render() {
    return (
      <div />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UnauthorizedHandler);
