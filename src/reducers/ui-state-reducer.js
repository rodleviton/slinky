import {
  SYNC_PACKAGES_START,
  SYNC_PACKAGES_END,
  LINKING_PACKAGE_START,
  LINKING_PACKAGE_END
} from '../actions/action-types';

// Set initial state
const initialState = {
  isSyncing: false,
  isLinking: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SYNC_PACKAGES_START:
      return {
        isSyncing: true
      };

    case SYNC_PACKAGES_END:
      return {
        isSyncing: false
      };

    case LINKING_PACKAGE_START:
      return {
        isLinking: true
      };

    case LINKING_PACKAGE_END:
      return {
        isLinking: false
      };

    default:
      return state
  }
};
