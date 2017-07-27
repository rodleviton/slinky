import {
  SYNC_PACKAGES_SUCCESS,
  SYNC_PACKAGES_START,
  SYNC_PACKAGES_END,
  LINKING_PACKAGE_START,
  LINKING_PACKAGE_END,
  SELECT_CONTEXT_START,
  SELECT_CONTEXT_SUCCESS,
  SELECT_CONTEXT_END,
  INITIALISE_CONTEXT_START,
  INITIALISE_CONTEXT_SUCCESS,
  INITIALISE_CONTEXT_END,
  CONTEXT_MENU_SHOW
} from './action-types';

// See issue: https://github.com/electron/electron/issues/9920
// import { ipcRenderer } from 'electron';
const { ipcRenderer } = window.require('electron');

export const syncPackages = () => (dispatch, getState) => {
  dispatch({ type: SYNC_PACKAGES_START });
  ipcRenderer.send('packages:sync', { context: getState().context.path });

  ipcRenderer.once('packages:synchronized', (event, payload) => {
    dispatch({ type: SYNC_PACKAGES_SUCCESS, payload });
    dispatch({ type: SYNC_PACKAGES_END });
  });
};

export const showContextMenu = () => (dispatch) => {
  dispatch({ type: CONTEXT_MENU_SHOW });
  ipcRenderer.send('context-menu:show');
};

export const setLinkage = (packageName, isLinked) => (dispatch, getState) => {
  const packageManager = getState().packages.manager.name;

  if (isLinked) {
    dispatch({ type: LINKING_PACKAGE_START });
    ipcRenderer.send('package:unlink', {
      context: getState().context.path,
      packageName,
      packageManager
    });

    ipcRenderer.once('package:unlinked', (event, payload) => {
      dispatch({ type: LINKING_PACKAGE_END });
      dispatch({ type: SYNC_PACKAGES_START });
      ipcRenderer.send('packages:sync', { context: getState().context.path });

      ipcRenderer.once('packages:synchronized', (event, payload) => {
        dispatch({ type: SYNC_PACKAGES_SUCCESS, payload });
        dispatch({ type: SYNC_PACKAGES_END });
      });
    });
  } else {
    dispatch({ type: LINKING_PACKAGE_START });
    ipcRenderer.send('package:link', {
      context: getState().context.path,
      packageName,
      packageManager
    });

    ipcRenderer.once('package:linked', (event, payload) => {
      dispatch({ type: LINKING_PACKAGE_END });
      dispatch({ type: SYNC_PACKAGES_START });
      ipcRenderer.send('packages:sync', { context: getState().context.path });

      ipcRenderer.once('packages:synchronized', (event, payload) => {
        dispatch({ type: SYNC_PACKAGES_SUCCESS, payload });
        dispatch({ type: SYNC_PACKAGES_END });
      });
    });
  }
};

export const selectContext = () => (dispatch) => {
  dispatch({ type: SELECT_CONTEXT_START });
  ipcRenderer.send('context:select');

  ipcRenderer.once('context:selected', (event, payload) => {
    dispatch({ type: SELECT_CONTEXT_SUCCESS, payload});
    dispatch({ type: SELECT_CONTEXT_END });
    dispatch({ type: SYNC_PACKAGES_START });
    ipcRenderer.send('packages:sync', { context: payload.path });

    ipcRenderer.once('packages:synchronized', (event, payload) => {
      dispatch({ type: SYNC_PACKAGES_SUCCESS, payload });
      dispatch({ type: SYNC_PACKAGES_END });
    });
  });
};

export const initialiseContext = () => (dispatch, getState) => {
  dispatch({ type: INITIALISE_CONTEXT_START });
  ipcRenderer.send('context:initialise', getState().context);

  ipcRenderer.once('context:initialised', (event, payload) => {
    dispatch({ type: INITIALISE_CONTEXT_SUCCESS, payload});
    dispatch({ type: INITIALISE_CONTEXT_END });
    dispatch({ type: SYNC_PACKAGES_START });
    ipcRenderer.send('packages:sync', { context: payload.path });

    ipcRenderer.once('packages:synchronized', (event, packagesPayload) => {
      dispatch({ type: SYNC_PACKAGES_SUCCESS, payload: packagesPayload });
      dispatch({ type: SYNC_PACKAGES_END });
    });
  });

  ipcRenderer.on('context-menu:sync', (event) => {
    dispatch({ type: SYNC_PACKAGES_START });
    ipcRenderer.send('packages:sync', { context: getState().context.path });

    ipcRenderer.once('packages:synchronized', (event, packagesPayload) => {
      dispatch({ type: SYNC_PACKAGES_SUCCESS, payload: packagesPayload });
      dispatch({ type: SYNC_PACKAGES_END });
    });
  });
};
