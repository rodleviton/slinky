import React from 'react';
import styles from './Header.scss';

const Header = ({ showContextMenu }) => {
  return (
    <header className={styles.header}>
      <div className={styles.arrow}></div>

      <div className={styles.headerContent}>
        <button className={styles.settings} onClick={showContextMenu}>
          <i className={styles.ionAndroidSettings}></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
