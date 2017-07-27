import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Package.scss';

const Package = ({ packageName, packagePath, isLinked, setLinkage }) => {
  const toggleClass = classNames({
    [styles.toggle]: true,
    [styles.active]: isLinked
  });

  return (
    <li className={styles.package}>
      <button onClick={() => setLinkage(packageName, isLinked)}>
        <p className={styles['package-name']}>{packageName}</p>
        <p className={styles['package-path']}>{packagePath}</p>
        <div className={toggleClass}>
          <div className={styles.toggleBtn}></div>
        </div>
      </button>
    </li>
  );
};

Package.propTypes = {
  packageName: PropTypes.string.isRequired,
  packagePath: PropTypes.string.isRequired,
  isLinked: PropTypes.bool.isRequired,
  setLinkage: PropTypes.func.isRequired
};

export default Package;
