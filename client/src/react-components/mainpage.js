import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Selectors from '../selectors';

import { AccountActions } from '../actions';

const mapStateToProps = state => ({
  isUserAuthenticated: Selectors.getUserIsAuthenticated(state),
  authenticatedUserName: Selectors.getNameOfAuthenticatedUser(state),
});

const mapDispatchToProps = dispatch => ({
  onUserAuth: bindActionCreators(AccountActions.authUser, dispatch),
});

class MyComponent extends Component {
  static propTypes = {
    name: PropTypes.string,
  };

  static defaultProps = {
    name: 'Stranger',
  };

  constructor(props) {
    super(props);
    this.onUserAuth = this.onUserAuth.bind(this);
  }

  onUserAuth() {
    this.props.onUserAuth(this.props.name);
  }

  render() {
    return (
      <div>
        Hello
        {this.props.name}
        {this.props.authenticatedUserName}
        !!
        {new Date().toLocaleTimeString()}
        {this.props.isUserAuthenticated.toString()}
        <button type="submit" onClick={this.onUserAuth}>
          SAVE
        </button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);
