import React, { Component } from 'react';
import { connect } from 'react-redux';
import Selectors from '../selectors';

const mapStateToProps = state => ({
  isUserAuthenticated: Selectors.getUserIsAuthenticated(state),
  authenticatedUserName: Selectors.getNameOfAuthenticatedUser(state),
});

class MyComponent extends Component {
  render() {
    return (
      <div>
        {this.props.isUserAuthenticated.toString()}
        {new Date().toLocaleTimeString()}
      </div>
    );
  }
}

export default connect(mapStateToProps)(MyComponent);
