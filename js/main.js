import menubar from 'menubar'
import { ipcMain } from 'electron'
import { dialog } from 'electron'
import linkEventHandler from './lib/linkEventHandler'

const app = menubar({
  icon: process.cwd() + '/images/IconTemplate.png'
})

ipcMain.on('open-file-dialog', function (event) {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, function (files) {
    if (files) {
      event.sender.send('selected-directory', files)
    }
  })
})

app.on('after-create-window', () => {
  app.window.openDevTools()
})

// re-sync linked modules when app is displayed
app.on('show', () => {
  // TODO Set Default context via service
  // console.log(app.app.getPath('home'))
})
