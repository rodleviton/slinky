import menubar from 'menubar'
import { ipcMain, dialog } from 'electron'
import './lib/linkEventHandler'
import path from 'path';

const app = menubar({
  icon: process.cwd() + '/app/images/IconTemplate.png'
})

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

app.on('after-create-window', () => {
  // if DEV
  app.window.openDevTools()

  app.window.webContents.once('did-finish-load', () => {
    const context = app.app.getPath('home')
    app.window.webContents.send('selected-directory', {context: context, name: getFolderName(context)})
  })
})


//app.on('window-all-closed', () => {
//  app.quit()
//});
