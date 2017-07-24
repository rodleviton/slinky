import packages from './packages-reducer.js';
import context from './context-reducer.js';
import uiState from './ui-state-reducer.js';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  packages,
  context,
  uiState
});

export default rootReducer;
