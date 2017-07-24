const Promise = require('bluebird');
const path = require('path');
const fs = Promise.promisifyAll(require('fs'));
const cp = Promise.promisifyAll(require('child_process'));

function linkPackage(packageName, context, packageManager) {
  return cp.execAsync(`${packageManager} link ${packageName}`, { cwd: context }).then((result) => {
    console.log(result);
  });
}

function unlinkPackage(packageName, context, packageManager) {
  return cp.execAsync(`${packageManager} unlink ${packageName}`, { cwd: context }).then((result) => {
    console.log(result);
  });
}

module.exports = {
  linkPackage,
  unlinkPackage
}
