export default {
  getUserIsAuthenticated(state) {
    return state.account.user_authenticated;
  },
  getNameOfAuthenticatedUser(state) {
    return state.account.user_name;
  },
  getSessionExpirationTime(state) {
    return state.session.expiration_time;
  },
};
