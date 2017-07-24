import React, { Component } from 'react';
import PackagesContainer from '../../containers/PackagesContainer';
import styles from './App.scss';

/**
 * Main App component
 */
class App extends Component {
  render() {
    return (
      <div className={styles.app}>
        <PackagesContainer />
      </div>
    );
  }
}

export default App;
