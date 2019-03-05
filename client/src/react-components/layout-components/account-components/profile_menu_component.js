import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Selectors from '../../../selectors';
import { AccountActions } from '../../../actions';
import handleErrors from '../../../../middlewares/error_handler_middleware';
import notificators from '../notification-components/notificators';

import '../../../../public/stylesheets/react_component_stylesheets/account/react_profile_menu.css';

const mapStateToProps = state => ({
  roleOfAuthenticatedUser: Selectors.getRoleOfAuthenticatedUser(state),
});

const mapDispatchToProps = dispatch => ({
  handleUserLogout: bindActionCreators(AccountActions.logoutUser, dispatch),
});

class ProfileMenu extends Component {
  constructor(props) {
    super(props);
    this.onUserLogOut = this.onUserLogOut.bind(this);
    this.handleClickLogOut = this.handleClickLogOut.bind(this);
  }

  onUserLogOut() {
    this.props.handleUserLogout();
  }

  handleClickLogOut() {
    fetch('/api/user/logout', {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(handleErrors)
      .then(res => res.json())
      .then((result) => {
        this.onUserLogOut();
        notificators.mainNotificator.showInfo(result.message);
      })
      .catch((error) => {
        this.onUserLogOut();
        switch (error.message) {
          case '401':
            notificators.mainNotificator.showInfo('User was already loged out');
            break;
          default:
            notificators.mainNotificator.showError('Error occure while create user');
            break;
        }
      });
  }

  render() {
    return (
      <div id="ProfileMenu">
        <div className="clickable"><span className="Option">Кабинет пользователя</span></div>
        {this.props.roleOfAuthenticatedUser.toLowerCase().includes('admin') ? <div className="clickable"><span className="Option">Создать статью</span></div> : undefined}
        <div className="clickable" role="button" tabIndex="0" onClick={this.handleClickLogOut} onKeyDown={this.handleClickLogOut}><span className="Option LogOut">Выйти</span></div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileMenu);
