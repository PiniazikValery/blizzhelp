import { AUTH_USER } from '../constants/action-types';

const initialState = {
  user_authenticated: false,
  user_name: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_USER:
      return Object.assign({}, state, {
        user_authenticated: true,
        user_name: action.payload,
      });
    default:
      return state;
  }
};

export default reducer;
