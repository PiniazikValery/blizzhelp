import { combineReducers } from 'redux';

import account from './account';
import session from './session';

export default combineReducers({
  account,
  session,
});
