const npm = require('npm')
const path = require('path')
const fs = require('graceful-fs')
const asyncMap = require('slide').asyncMap

const getSymlinkPossibilities = (cb) => {
  npm.load((err) => {
    fs.readdir(npm.globalDir, (er, children) => {

      if (er && er.code !== 'ENOTDIR') return cb(er)

      asyncMap(children, (pkg, cb) => {

        var pkgPath = path.resolve(npm.globalDir, pkg)

        fs.lstat(pkgPath, (er, stat) => {
          if (er) return cb(er)

          if (stat.isSymbolicLink()) {
            fs.realpath(pkgPath, (er, realPath) => {
              if (er) return cb(er)
              return cb(null, {name: pkg, target: pkgPath, realTargetPath: realPath})
            })
          } else {
            return cb()
          }

        })
      }, (err, pkgs) => {
        if (err) return cb(err)

        return cb(null, pkgs)
      })
    })
  })
}

const getSymlinkList = (source, cb) => {
  npm.load((err) => {

    const npmDir = path.resolve(source, 'node_modules')

    fs.readdir(npmDir, (er, children) => {

      if (er && er.code !== 'ENOTDIR') return cb(er)

      asyncMap(children, (pkg, cb) => {

        var pkgPath = path.resolve(npmDir, pkg)
        var linkedPath = path.resolve(npm.globalDir, pkg)

        fs.lstat(pkgPath, function(er, stat) {
          if (er) return cb(er)

          if (stat.isSymbolicLink()) {
            fs.realpath(pkgPath, (er, realPath) => {
              if (er) return cb(er)
              return cb(null, {name: pkg, src: linkedPath, target: pkgPath, realTargetPath: realPath})
            })
          } else {
            return cb()
          }

        })
      }, (err, pkgs) => {
        if (err) return cb(err)

        return cb(null, pkgs)
      })
    })
  })
}

module.exports = {
  getSymlinkPossibilities: getSymlinkPossibilities,
  getSymlinkList: getSymlinkList
}
