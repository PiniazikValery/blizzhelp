import { createAction } from 'redux-action';
import { AUTH_USER, LOG_OUT_USER } from '../constants/action-types';


const authUser = createAction(AUTH_USER);

const logoutUser = createAction(LOG_OUT_USER);

export default {
  authUser(payload) {
    return authUser(payload);
  },
  logoutUser() {
    return logoutUser();
  },
};
