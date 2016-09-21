import { ipcRenderer } from 'electron'
import { sortBy } from 'lodash'

const packageList = document.getElementById('packageList')
const syncIndicator = document.getElementById('syncIndicator')
const syncText = document.getElementById('syncText')

// TODO - Set default context via service from main process
let context = '/'

const broadcastSync = () => {
  updateSyncState(true)
  ipcRenderer.send('sync', { context: context })
}

const getItem = (pkg, index, isActive) => {
  return (
    `<li id="pkg-${index + 1}" class="list-group-item ${isActive ? 'active' : ''}">
      <span class="media-object"><i class="icon"></i></span>

      <div class="media-body">
        <pre><code class="list-group-item-title">${pkg.name}</code></pre>
        <pre><code>${pkg.realTargetPath}</code></pre>
      </div>
    </li>`
  )
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

const render = (config) => {

  // Sort arrays
  config.symlinkPossibilities = config.symlinkPossibilities || []
  config.symlinkSelections = config.symlinkSelections || []
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
  const listHTML = items.map((item, index) => {
    return item.html
  })

  packageList.innerHTML = listHTML.join('')

  // Add click handlers
  items.forEach((item, index) => {
    ((i) => {
      document.getElementById(`pkg-${i + 1}`).addEventListener('click', (event) => {
        updateSyncState(true)

        if(!event.currentTarget.classList.contains('processing')) {
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

// Select directory
const selectDirectoryBtn = document.getElementById('select-folder')

selectDirectoryBtn.addEventListener('click', function () {
  ipcRenderer.send('open-file-dialog')
})

ipcRenderer.on('selected-directory', function (event, path) {
  context = path[0]
  document.getElementById('selected-folder').innerHTML = path[0]
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
  render(packages)
})

// Kick things off
broadcastSync()
