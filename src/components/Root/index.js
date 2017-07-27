import React from 'react';
import { Provider } from 'react-redux';
import App from '../App';
import './Root.scss';

/**
 * Root component
 */
const Root = ({ store }) => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default Root;
