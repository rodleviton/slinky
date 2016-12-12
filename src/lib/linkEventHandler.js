import cp from 'child_process'
import log from 'electron-log'

import { ipcMain } from 'electron'
import sync from './sync'
import path from 'path'

var fs = require('graceful-fs')

let npmExec = 'npm';

let enableYarnMode = false;

if (enableYarnMode) {
  cp.exec('yarn info', {},  (error) => {

    // and yarn.lock exists
    if (!error && !fs.accessSync(path.join(process.cwd(), 'yarn.lock'))) {
    npmExec = 'yarn info';

    log.info('\nFound yarn.lock, setting to YARN mode.\n');
  }
})
}

ipcMain.on('link-package', (event, arg) => {

  log.info('link-package ...')
  cp.exec(`${npmExec} link ${arg.name}`, { cwd: arg.context }, (error) => {
    if (error) {
      log.warn(error)
    }
    event.sender.send('package-linked')
    log.info('... link-package')
  })
})

ipcMain.on('unlink-package', (event, arg) => {
  log.info('unlink-package ...')
  cp.exec(`${npmExec} unlink ${arg.name}`, { cwd: arg.context }, (error) => {
    if (error) {
      log.warn(error)
    }
    event.sender.send('package-unlinked')
    log.info('unlink-package ...')
  })
})

ipcMain.on('sync', (event, arg) => {

  log.info('sync ...')
  sync(arg.context, (error, result) => {

    if (error) {
      log.warn(error)
    }

    event.sender.send('sync-complete', result)
    log.info('...sync')
  })
})
