import React from 'react';
import classNames from 'classnames';
import styles from './Footer.scss';

function getSyncStatus(isSyncing) {
  if (isSyncing) {
    return (<p><span className={styles.iconWrapper}><i className={styles.ionAndroidSync}></i></span> Syncing...</p>);
  } else {
    return (<p><span className={styles.iconWrapper}><i className={styles.ionCheckmark}></i></span> Up to date.</p>);
  }
}

function getPackageManagerIcon(packageManager) {
  if (packageManager === 'yarn') {
    return (<p>Yarn available. <i className={styles.yarnIconAvailable}></i></p>);
  } else {
    return (<p>Yarn not available. <i className={styles.yarnIconNotAvailable}></i></p>);
  }
}

const Footer = ({ isSyncing, packageManager }) => {
  const statusClass = classNames({
    [styles.status]: true,
    [styles.isSyncing]: isSyncing
  });

  return (
    <footer className={styles.footer}>
      <div className={statusClass}>{ getSyncStatus(isSyncing) }</div>
      <div className={styles.packageManager}>{ getPackageManagerIcon(packageManager) }</div>
    </footer>
  );
};

export default Footer;
