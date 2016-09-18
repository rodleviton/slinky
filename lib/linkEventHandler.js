const cp = require('child_process')
const ipc = require('electron').ipcMain

ipc.on('link-package', (event, arg) => {
  cp.exec(`npm link ${arg.name}`, {cwd: arg.context}, (error, stdout, stderr) => {
    if(error) {
      console.warn(error)
    }
    event.sender.send('package-linked')
  })
})

ipc.on('unlink-package', (event, arg) => {
  cp.exec(`npm unlink ${arg.name}`, {cwd: arg.context}, (error, stdout, stderr) => {
    if(error) {
      console.warn(error)
    }
    event.sender.send('package-unlinked')
  })
})
