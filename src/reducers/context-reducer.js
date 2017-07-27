import { SELECT_CONTEXT_SUCCESS, INITIALISE_CONTEXT_SUCCESS } from '../actions/action-types';

// Set initial state
const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case SELECT_CONTEXT_SUCCESS:
      return action.payload;

    case INITIALISE_CONTEXT_SUCCESS:
      return action.payload;

    default:
      return state
  }
};
