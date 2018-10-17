import { createAction } from 'redux-action';
import { AUTH_USER } from '../constants/action-types';


const authUser = createAction(AUTH_USER);

export default {
  authUser(payload) {
    return authUser(payload);
  },
};
