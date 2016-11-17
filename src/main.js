import menubar from 'menubar'
import electron from 'electron'
import { ipcMain, dialog, Menu, MenuItem, BrowserWindow } from 'electron'
import './lib/linkEventHandler'
import path from 'path';
const osTarget = 'linux'

// placeholder for app
let app

// Determine type of app to open based on OS
if (process.platform === osTarget) {
  openWindowApp()
} else {
  openTrayApp()
}

// from https://github.com/sindresorhus/electron-is-dev/blob/master/index.js
function isDevMode() {
  return process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)
}

function getFolderName(folder) {
  const n = folder.lastIndexOf(path.sep)
  return folder.substring(n + 1)
}

ipcMain.on('open-file-dialog', function (event) {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, function (folder) {
    if (folder) {
      folder = folder[0]
      const folderName = getFolderName(folder)
      event.sender.send('selected-directory', {
        context: folder,
        name: folderName
      })
    }
  })
})

function openWindowApp() {
  app = electron.app

  function createWindow () {
    // Create the browser window.
    let mainWindow = new BrowserWindow({ width: 500, height: 600, frame: false, transparent: true })

    // and load the index.html of the app.
    const modalPath = path.join('file://', __dirname, '../app/index.html')
    mainWindow.loadURL(modalPath)

    // Open the DevTools.
    if (isDevMode()) { mainWindow.webContents.openDevTools() }

    mainWindow.webContents.once('did-finish-load', () => {
      const context = app.getPath('home')
      mainWindow.webContents.send('selected-directory', {context: context, name: getFolderName(context)})
    })

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null
    })
  }

  // Module to control application life.
  app.on('ready', () => {
    createWindow()
  })

  // Create context menu
  const menu = new Menu()
  menu.append(new MenuItem({ label: 'Quit Slinky', click: () => app.quit() }))

  app.on('browser-window-created', function (event, win) {
    win.webContents.on('context-menu', function (e, params) {
      menu.popup(win, params.x, params.y)
    })
  })

  ipcMain.on('show-context-menu', function (event) {
    const win = BrowserWindow.fromWebContents(event.sender)
    menu.popup(win)
  })
}

function openTrayApp() {
  const trayWindowOptions = {
    transparent: true,
    icon: path.join(__dirname, 'images', 'IconTemplate.png')
  }

  app = menubar(trayWindowOptions)

  app.on('after-create-window', (options) => {
    if (isDevMode()) { app.window.openDevTools() }

    app.window.webContents.once('did-finish-load', () => {
      const context = app.app.getPath('home')
      app.window.webContents.send('selected-directory', {context: context, name: getFolderName(context)})
    })
  })

  // Create context menu
  const menu = new Menu()
  menu.append(new MenuItem({ label: 'Quit Slinky', click: () => app.app.quit() }))

  app.on('browser-window-created', function (event, win) {
    win.webContents.on('context-menu', function (e, params) {
      menu.popup(win, params.x, params.y)
    })
  })

  ipcMain.on('show-context-menu', function (event) {
    const win = BrowserWindow.fromWebContents(event.sender)
    menu.popup(win)
  })
}