import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import throttle from 'lodash/throttle';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { loadState, saveState } from './local-storage';

const loggerMiddleware = createLogger();

const configureStore = () => {
  const persistedState = loadState();

  const store = createStore(rootReducer, persistedState,
    composeWithDevTools(
      applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
      )
    )
  );

  store.subscribe(throttle(() => {
    saveState(store.getState());
  }, 1000));

  return store;
};

export default configureStore;
