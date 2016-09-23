import cp from 'child_process'
import { ipcMain } from 'electron'
import sync from './sync'

ipcMain.on('link-package', (event, arg) => {
  cp.exec(`npm link ${arg.name}`, { cwd: arg.context }, (error, stdout, stderr) => {
    if (error) {
      console.warn(error)
    }
    event.sender.send('package-linked')
  })
})

ipcMain.on('unlink-package', (event, arg) => {
  cp.exec(`npm unlink ${arg.name}`, { cwd: arg.context }, (error, stdout, stderr) => {
    if (error) {
      console.warn(error)
    }
    event.sender.send('package-unlinked')
  })
})

ipcMain.on('sync', (event, arg) => {
  sync(arg.context, (error, result) => {
    if (error) {
      console.warn(error)
    }

    event.sender.send('sync-complete', result)
  })
})
