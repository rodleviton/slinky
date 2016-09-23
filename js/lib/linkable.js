import npm from 'npm'
import { resolve } from 'path'
import fs from 'graceful-fs'
import { asyncMap } from 'slide'

export function symlinkPossibilities(cb) {
  npm.load((err) => {
    fs.readdir(npm.globalDir, (er, children) => {

      if (er && er.code !== 'ENOTDIR') return cb(er)

      asyncMap(children, (pkg, cb) => {

        const pkgPath = resolve(npm.globalDir, pkg)

        fs.lstat(pkgPath, (er, stat) => {
          if (er) return cb(er)

          if (stat.isSymbolicLink()) {
            fs.realpath(pkgPath, (er, realPath) => {
              if (er) return cb(er)
              return cb(null, { name: pkg, target: pkgPath, realTargetPath: realPath })
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

export function symlinkSelections(source, cb) {
  npm.load((err) => {

    const npmDir = resolve(source, 'node_modules')

    // Check if node_modules folder exists
    fs.lstat(npmDir, function(er, stat) {
      if (er) return cb(null, [])

      fs.readdir(npmDir, (er, children) => {

      if (er && er.code !== 'ENOTDIR') return cb(er)

      asyncMap(children, (pkg, cb) => {

        const pkgPath = resolve(npmDir, pkg)
        const linkedPath = resolve(npm.globalDir, pkg)

        fs.lstat(pkgPath, function(er, stat) {
          if (er) return cb(er)

          if (stat.isSymbolicLink()) {
            fs.realpath(pkgPath, (er, realPath) => {
              if (er) return cb(er)
              return cb(null, { name: pkg, src: linkedPath, target: pkgPath, realTargetPath: realPath })
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
  })
}
