const electron = require('electron');
const path = require('path');
const url = require('url');
const fixPath = require('fix-path');
const { app, BrowserWindow, ipcMain, dialog, Menu, MenuItem, Tray } = electron;
const syncPackages = require('./sync-packages');
const { linkPackage, unlinkPackage} = require('./link-packages');

//////////////////////////////////////////////////////////
// CONFIGURE
//////////////////////////////////////////////////////////

let mainWindow;
let tray;

app.on('ready', () => {
  // https://github.com/electron/electron/issues/7688
  fixPath();

  app.dock.hide(); // remove dock icon

  // Add some awesome debugging tools if in dev mode
  if (process.env.NODE_ENV === 'development') {
    const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');

    installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));

    installExtension(REDUX_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
  }

  const windowOptions = {
    height: 420,
    width: 380,
    transparent: true,
    frame: false,
    resizable: false,
    webPreferences: { backgroundThrottling: true },
    show: false
  };

  mainWindow = new BrowserWindow(windowOptions);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL(`http://localhost:3000`);
  } else {
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, '../build/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // mainWindow.setAlwaysOnTop(true, 'dock');

  tray = new Tray(path.join(__dirname, 'assets/IconTemplate.png'));

  tray.on('click', (event, bounds) => {
    const { x, y } = bounds;
    const { height, width } = mainWindow.getBounds();

    if (mainWindow.isVisible()) {
      // mainWindow.hide();
    } else {
      mainWindow.setBounds({
        x: x - (width / 2) + 10,
        y,
        height,
        width
      });

      mainWindow.show();
    }
  });

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  tray.setToolTip('Slinky');

  mainWindow.on('show', () => {
    tray.setHighlightMode('always')
  });

  mainWindow.on('hide', () => {
    tray.setHighlightMode('never')
  });

  mainWindow.on('blur', () => {
    // mainWindow.hide();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    mainWindow = null;
  });
});

// Create context menu
const menu = new Menu()
menu.append(new MenuItem({ label: 'Sync Packages', click: () => mainWindow.webContents.send('context-menu:sync') }))
menu.append(new MenuItem({ label: 'Quit Slinky', click: () => app.quit() }))

app.on('browser-window-created', function (event, win) {
  win.webContents.on('context-menu', function (e, params) {
    menu.popup(win, params.x, params.y);
  });
});

//////////////////////////////////////////////////////////
// ACTIONS
//////////////////////////////////////////////////////////

ipcMain.on('packages:sync', (event, data) => {
  syncPackages(data.context).then((packages) => {
    mainWindow.webContents.send('packages:synchronized', packages);
  });
});

ipcMain.on('package:link', (event, data) => {
  linkPackage(data.packageName, data.context, data.packageManager).then(() => {
    mainWindow.webContents.send('package:linked');
  });
});

ipcMain.on('package:unlink', (event, data) => {
  unlinkPackage(data.packageName, data.context, data.packageManager).then(() => {
    mainWindow.webContents.send('package:unlinked');
  });
});

ipcMain.on('context-menu:show', function (event) {
  const win = BrowserWindow.fromWebContents(event.sender);
  menu.popup(win);
});

function getFolderName(folder) {
  const n = folder.lastIndexOf(path.sep);
  return folder.substring(n + 1);
}

ipcMain.on('context:initialise', (event, data) => {
  let context = {};

  if (!data.path) {
    const homeFolder = app.getPath('home');

    context = {
      path: homeFolder,
      folderName: getFolderName(homeFolder)
    }
  } else {
    context = {
      path: data.path,
      folderName: data.folderName
    }
  }

  mainWindow.webContents.send('context:initialised', context);
});

ipcMain.on('context:select', () => {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, (folder) => {
    if (folder) {
      mainWindow.webContents.send('context:selected', {
        path: folder[0],
        folderName: getFolderName(folder[0])
      });
    }
  });
});
