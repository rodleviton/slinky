const ipc = require('electron').ipcRenderer
const linkable = require('./lib/linkable')
const _ = require('lodash');

const appConfig = {}
const pkgList = document.getElementById('pkgList')
const syncIndicator = document.getElementById('syncIndicator')
const syncText = document.getElementById('syncText')
let context = '/Users/rodleviton/Dev/doogie'

const sync = () => {
  updateSyncState(true)

  linkable.getSymlinkPossibilities((err, pkgs) => {
    if (err) {
      console.warn(err)
    } else {
      appConfig.availablePkgs = pkgs || [];
      updatePkgList();
    }
  });

  linkable.getSymlinkList(context, (err, pkgs) => {
    if (err) {
      console.warn(err)
    } else {
      appConfig.linkedPkgs = pkgs || [];
      updatePkgList();
    }
  });
}

const getItem = (pkg, index, isActive) => {
  return (
    `<li id="pkg-${index + 1}" class="list-group-item ${isActive ? 'active' : ''}">
      <span class="icon media-object pull-left"></span>

      <div class="media-body">
        <pre><code class="package-title">${pkg.name}</code></pre>
        <pre><code>${pkg.realTargetPath}</code></pre>
      </div>
    </li>`
  )
}

const updateSyncState = (isSyncing) => {
  if (isSyncing) {
    syncIndicator.classList.add('is-animating')
    syncText.innerHTML = 'Syncing..'
  } else {
    syncIndicator.classList.remove('is-animating')
    syncText.innerHTML = 'Synced'
  }
}

const updatePkgList = () => {
  let items = []
  let linkedItems = []

  if(appConfig.availablePkgs && appConfig.linkedPkgs) {

    // Sort arrays
    appConfig.availablePkgs = _.sortBy(appConfig.availablePkgs, 'name')

    // Mark linked packages
    appConfig.linkedPkgs.forEach((pkg) => {
      linkedItems.push(pkg.name);
    })

    // Create list of available packages
    appConfig.availablePkgs.forEach((pkg, index) => {
      let isActive = linkedItems.indexOf(pkg.name) > -1
      items.push({
        name: pkg.name,
        active: isActive,
        html: getItem(pkg, index, isActive)
      })
    })

    // Update DOM
    pkgList.innerHTML = ''
    let listHTML = ''

    items.forEach((item, index) => {
      listHTML += item.html
    })

    pkgList.innerHTML += listHTML

    // Add click handlers
    items.forEach((item, index) => {
      ((i) => {
        document.getElementById(`pkg-${i + 1}`).addEventListener('click', (event) => {
          updateSyncState(true)

          if(!event.currentTarget.classList.contains('processing')) {
            if (item.active) {
              ipc.send('unlink-package', {name: item.name, context: context})
            } else {
              ipc.send('link-package', {name: item.name, context: context})
            }

            event.currentTarget.classList.add('processing')
          }

        })
      })(index)
    })

    updateSyncState(false)
  }
}

// Select directory
const selectDirBtn = document.getElementById('select-folder')

selectDirBtn.addEventListener('click', function (event) {
  ipc.send('open-file-dialog')
})

ipc.on('selected-directory', function (event, path) {
  context = path[0]
  document.getElementById('selected-folder').innerHTML = path[0]
  sync();
})

// Main process event listeners
ipc.on('package-linked', function (event, arg) {
  sync();
})

ipc.on('package-unlinked', function (event, arg) {
  sync();
})

sync();
