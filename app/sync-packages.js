const Promise = require('bluebird');
const path = require('path');
const fs = Promise.promisifyAll(require('fs'));
const cp = require('child_process');

let userHome = require('user-home');

if (process.platform === 'linux' && process.env.USER === 'root') {
  userHome = path.resolve('/usr/local/share');
}

// https://github.com/yarnpkg/yarn/issues/2049
function getYarnDirectory() {
  return new Promise((resolve, reject) => {
    // use %LOCALAPPDATA%/Yarn on Windows
    if (process.platform === 'win32' && process.env.LOCALAPPDATA) {
      resove(path.join('%LOCALAPPDATA%', 'Yarn', 'config', 'link'));
    }

    // linux | osx
    resolve(path.join(userHome, '.config', 'yarn', 'link'));
  });
}

function getNpmDirectory() {
  return new Promise((resolve, reject) => {
    cp.execFile('npm', ['root', '-g'], (error, stdout, stderr) => {
      if (error) {
        resolve(error);
      }

      if (stderr) {
        resolve(stderr);
      }

      resolve(stdout.trim());
    });
  });
}

function getLinkedPackagesDirectory(context) {

  return new Promise((resolve) => {
    fs.lstat(path.join(context, 'yarn.lock'), (err, stats) => {
      if (!err) {
        getYarnDirectory().then(result => resolve({ name: 'yarn', formatted: 'Yarn', path: result }));
      } else {
        getNpmDirectory().then(result => resolve({ name: 'npm', formatted: 'NPM', path: result }))
      }
    });
  });
};

function getLinkedPackages(context, globalDir) {
  const localNpmDirectory = path.resolve(context, 'node_modules');

  return fs.lstatAsync(localNpmDirectory).then((stat) => {
    return fs.readdirAsync(localNpmDirectory).map((npmPackageName) => {

      const localPackagePath = path.resolve(localNpmDirectory, npmPackageName);
      const absolutePackagePath = path.resolve(globalDir, npmPackageName);

      return fs.lstatAsync(localPackagePath).then((stat) => {
        if (stat.isSymbolicLink()) {
          return fs.realpathAsync(absolutePackagePath).then((realPath) => ({
            name: npmPackageName,
            path: localPackagePath,
            absolutePath: absolutePackagePath
          }));
        }
      });

    }).then((results) => {
      if (results) {
        return results.filter(result => !!result);
      }

      return [];
    })
  }).catch(() => []);
};

function getAvailablePackages(context, globalDir) {
  return fs.readdirAsync(globalDir).map((npmPackageName) => {
    const absolutePackagePath = path.resolve(globalDir, npmPackageName);

    return fs.lstatAsync(absolutePackagePath).then((stat) => {
      if (stat.isSymbolicLink()) {
        return fs.realpathAsync(absolutePackagePath).then((realPath) => ({
          name: npmPackageName,
          path: realPath,
          absolutePath: absolutePackagePath
        }));
      }
    });

  })
  .then((results) => {
    if (results) {
      return results.filter(result => !!result);
    }

    return [];
  });
};

module.exports = (context) => {
  return getLinkedPackagesDirectory(context)
    .then(packageManager => ({ manager: packageManager }))
    .then((result) => {
      return getAvailablePackages(context, result.manager.path).then((availablePackages) => {
        return Object.assign({}, { available: availablePackages }, result)
      });
    })
    .then((result) => {
      return getLinkedPackages(context, result.manager.path).then((linkedPackages) => {
        return Object.assign({}, { linked: linkedPackages }, result)
      });
    });
};
