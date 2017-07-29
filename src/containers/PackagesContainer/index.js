import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/package-actions';
import Package from '../../components/Package';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from './PackagesContainer.scss';


class PackagesContainer extends Component {
  componentWillMount() {
    const { initialiseContext } = this.props.actions;

    // Initialise working directory and Synchronize packages
    initialiseContext();
  }


  isLinked(packageName) {
    const { linkedPackages } = this.props;

    return !!linkedPackages.filter((pkg) => pkg.name === packageName).length;
  }

  renderPackage(npmModule, packageManager) {
    const { setLinkage } = this.props.actions;
    const isLinked = this.isLinked(npmModule.name);

    return (
      <Package
        key={npmModule.name}
        isLinked={isLinked}
        packageName={npmModule.name}
        packagePath={npmModule.path}
        setLinkage={setLinkage} />
    );
  }

  render() {
    const { availablePackages, packageManager, context, uiState } = this.props;
    const {
      selectContext,
      showContextMenu
    } = this.props.actions;

    if (availablePackages) {
      if (availablePackages.length > 0) {
        return (
          <div>
            <Header showContextMenu={showContextMenu}/>
            <main className={styles.main}>
              <button onClick={selectContext} className={styles['select-context']}>
                <div className={styles['folder-icon']}>
                  <i className="icon ion-ios-folder-outline"></i>
                </div>
                <div className={styles.content}>
                  <span className={styles['folder-name']}>{context.folderName}</span>
                  <span className={styles.path}>{context.path}</span>
                </div>
              </button>
              <ul className={styles.packageList}>
                { availablePackages.map((npmModule) => this.renderPackage(npmModule, packageManager.name)) }
              </ul>
            </main>
            <Footer isSyncing={uiState.isSyncing} packageManager={packageManager.name} />
          </div>
        );
      } else {
        return (
          <div>
            <Header showContextMenu={showContextMenu}/>
            <main className={styles.main}>
              <button onClick={selectContext} className={styles['select-context']}>
                <div className={styles['folder-icon']}>
                  <i className="icon ion-ios-folder-outline"></i>
                </div>
                <div className={styles.content}>
                  <span className={styles['folder-name']}>{context.folderName}</span>
                  <span className={styles.path}>{context.path}</span>
                </div>
              </button>
              <div className={styles.noLinkedPackages}>
                <p>No linked modules available.</p>
              </div>
            </main>
            <Footer isSyncing={uiState.isSyncing} packageManager={packageManager.name} />
          </div>
        );
      }
    } else {
      return (<div></div>);
    }
  }
}

function mapStateToProps(state, props) {
  return {
    availablePackages: state.packages.available,
    linkedPackages: state.packages.linked,
    packageManager: state.packages.manager,
    context: state.context,
    uiState: state.uiState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PackagesContainer);
