import menubar from 'menubar'
import { ipcMain } from 'electron'
import { dialog } from 'electron'
import './lib/linkEventHandler'

const app = menubar({
  icon: process.cwd() + '/images/IconTemplate.png'
})

ipcMain.on('open-file-dialog', function (event) {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, function (folder) {
    if (folder) {
      const n = folder[0].lastIndexOf('/')
      const folderName = folder[0].substring(n + 1)

      event.sender.send('selected-directory', {
        context: folder[0],
        name: folderName
      })
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
