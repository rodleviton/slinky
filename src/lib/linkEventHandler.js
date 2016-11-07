import cp from 'child_process'
import { ipcMain } from 'electron'
import sync from './sync'
import path from 'path';

var fs = require('graceful-fs')

let npmExec = 'npm';

let enableYarnMode = false;

if (enableYarnMode) {
  cp.exec('yarn info', {},  (error) => {

    // and yarn.lock exists
    if (!error && !fs.accessSync(path.join(process.cwd(), 'yarn.lock'))) {
    npmExec = 'yarn info';

    console.info('\nFound yarn.lock, setting to YARN mode.\n');
  }
})
}

ipcMain.on('link-package', (event, arg) => {
  cp.exec(`${npmExec} link ${arg.name}`, { cwd: arg.context }, (error) => {
    if (error) {
      console.warn(error)
    }
    event.sender.send('package-linked')
  })
})

ipcMain.on('unlink-package', (event, arg) => {
  cp.exec(`${npmExec} unlink ${arg.name}`, { cwd: arg.context }, (error) => {
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
