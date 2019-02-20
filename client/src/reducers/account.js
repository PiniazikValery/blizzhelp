import { AUTH_USER, LOG_OUT_USER } from '../constants/action-types';

const initialState = {
  user_authenticated: false,
  user_name: null,
  user_role: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_USER:
      return Object.assign({}, state, {
        user_authenticated: true,
        user_name: action.payload.username,
        user_role: action.payload.user_role,
      });
    case LOG_OUT_USER:
      return Object.assign({}, state, {
        user_authenticated: false,
        user_name: null,
        user_role: null,
      });
    default:
      return state;
  }
};

export default reducer;
