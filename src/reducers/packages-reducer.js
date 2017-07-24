import { SYNC_PACKAGES_SUCCESS } from '../actions/action-types';

// Set initial state
const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case SYNC_PACKAGES_SUCCESS:
      return action.payload;

    default:
      return state
  }
};
