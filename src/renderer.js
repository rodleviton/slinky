import {ipcRenderer} from 'electron'
import {sortBy} from 'lodash'

const bodyEl = document.body
const packageList = document.getElementById('package-list')
const notificationPanel = document.getElementById('notification-panel')
const syncIndicator = document.getElementById('sync-indicator')
const syncText = document.getElementById('syncText')

// TODO - Set default context via service from main process
let context

// Add OS class to body
bodyEl.classList.add(process.platform)

const broadcastSync = () => {
  updateSyncState(true)
  ipcRenderer.send('sync', { context: context })
}

const getItem = (pkg, index, isActive) => {
  return `
    <li id="pkg-${index + 1}" class="list-group-item ${isActive ? 'active' : ''}">
      <span class="media-object"><i class="icon"></i></span>

      <div class="media-body">
        <pre><code class="list-group-item-title">${pkg.name}</code></pre>
        <pre><code class="list-group-item-path">${pkg.realTargetPath}</code></pre>
      </div>
    </li>
  `
}

const updateSyncState = (isSyncing) => {
  if (isSyncing) {
    syncIndicator.classList.add('is-animating')
    syncText.innerHTML = 'Syncing...'
  } else {
    syncIndicator.classList.remove('is-animating')
    syncText.innerHTML = 'Synced'
  }
}

const render = (config, context) => {
  // Show package list
  showPackageList()

  // Hide any notifications
  hideErrorMessage()

  // Sort arrays
  config.symlinkPossibilities = sortBy(config.symlinkPossibilities, 'name')

  // Mark linked packages
  const linkedItems = config.symlinkSelections.map((pkg) => {
    return pkg.name
  })

  // Create list of available packages
  const items = config.symlinkPossibilities.map((pkg, index) => {
    const isActive = linkedItems.includes(pkg.name)

    return {
      name: pkg.name,
      active: isActive,
      html: getItem(pkg, index, isActive)
    }
  })

  // Update DOM
  const listHTML = items.map((item) => {
    return item.html
  })

  packageList.innerHTML = listHTML.join('')

  // Add click handlers
  items.forEach((item, index) => {
    ((i) => {
      document.getElementById(`pkg-${i + 1}`).addEventListener('click', (event) => {
        updateSyncState(true)

        if (!event.currentTarget.classList.contains('processing')) {
          if (item.active) {
            ipcRenderer.send('unlink-package', { name: item.name, context: context })
          } else {
            ipcRenderer.send('link-package', { name: item.name, context: context })
          }

          event.currentTarget.classList.add('processing')
        }
      })
    })(index)
  })

  updateSyncState(false)
}

// Tell main process to show the menu when demo button is clicked
const contextMenuBtn = document.getElementById('context-menu')
contextMenuBtn.addEventListener('click', function () {
  ipcRenderer.send('show-context-menu')
})

const hidePackageList = () => {
  packageList.classList.add('hide')
}

const showPackageList = () => {
  packageList.classList.remove('hide')
}

const hideErrorMessage = () => {
  notificationPanel.classList.add('hide')
}

const showErrorMessage = () => {
  notificationPanel.classList.remove('hide')
}

const handleNotification = () => {
  // Hide package list
  hidePackageList()

  // Show a notification
  showErrorMessage()

  // Stop sync display
  updateSyncState(false)
}

// Select directory
const selectDirectoryBtn = document.getElementById('select-folder')

selectDirectoryBtn.addEventListener('click', function () {
  ipcRenderer.send('open-file-dialog')
})

ipcRenderer.on('selected-directory', function (event, result) {
  context = result.context
  document.getElementById('selected-folder').innerHTML = result.name
  broadcastSync()
})

// Main process event listeners
ipcRenderer.on('package-linked', function () {
  broadcastSync()
})

ipcRenderer.on('package-unlinked', function () {
  broadcastSync()
})

ipcRenderer.on('sync-complete', function (event, packages) {
  if (packages.symlinkSelections.error) {
    handleNotification()
  } else {
    render(packages, context)
  }

})
