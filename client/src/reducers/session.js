import { SET_SESSION_EXPIRATION_TIME } from '../constants/action-types';

const initialState = {
  expiration_time: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SESSION_EXPIRATION_TIME:
      return Object.assign({}, state, {
        expiration_time: new Date().getTime() + action.payload,
      });
    default:
      return state;
  }
};

export default reducer;
