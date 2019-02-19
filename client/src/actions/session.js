import { createAction } from 'redux-action';
import { SET_SESSION_EXPIRATION_TIME } from '../constants/action-types';

const setSessionExpirationTime = createAction(SET_SESSION_EXPIRATION_TIME);

export default {
  setSessionExpirationTime(payload) {
    return setSessionExpirationTime(payload);
  },
};
