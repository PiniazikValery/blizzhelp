import React, { Component } from 'react';
import '../../../public/stylesheets/react_component_stylesheets/account/react_signIn.css';

class SignIn extends Component {
  render() {
    return (
      <div id="signInMenu">
        <form>
          <h4>Sign In</h4>
          <ul id="menuFields">
            <li>
              <input placeholder="Email" id="signInEmail" />
            </li>
            <li>
              <input type="password" placeholder="Passwod" id="signInPassword" />
            </li>
          </ul>
          <button type="submit">Sign In</button>
        </form>
      </div>
    );
  }
}

export default SignIn;
