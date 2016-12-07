import log from 'electron-log'
import { resolve } from 'path'
import fs from 'graceful-fs'
import { asyncMap } from 'slide'
import cp from 'child_process'
import path from 'path'

import 'shelljs/global'

const whichNpm = which('npm')

if (!whichNpm) {
  echo('Sorry, this script requires npm in the path');
  exit(1);
}

const npmPath = whichNpm.stdout

log.info('Using NPM path:', npmPath);

let globalDir;

function getNpmGlobalRootDirectory(cb) {

  if (globalDir) {
    return cb();
  }

  cp.exec(npmPath + ' root -g',  (error, stdout, stderr) => {
    if (error) {
      log.error(error)
      return;
    }

    if (stderr) {
      log.error('Error:', stderr)
    }

    globalDir = stdout.trim();
    return cb();
  })

}


export function symlinkPossibilities(cb) {
  getNpmGlobalRootDirectory(() => {

    fs.readdir(globalDir, (er, children) => {

      if (er && er.code !== 'ENOTDIR') {
        return cb(er)
      }

      asyncMap(children, (pkg, cb) => {

        const pkgPath = resolve(globalDir, pkg)

        fs.lstat(pkgPath, (er, stat) => {
          if (er) {
            return cb(er)
          }

          if (stat.isSymbolicLink()) {
            fs.realpath(pkgPath, (er, realPath) => {
              if (er) {
                return cb(er)
              }
              return cb(null, { name: pkg, target: pkgPath, realTargetPath: realPath })
            })
          } else {
            return cb()
          }

        })
      }, (err, pkgs) => {
        if (err) {
          return cb(err)
        }

        const result = pkgs || [];

        return cb(null, result)
      })
    })
  })
}

export function symlinkSelections(source, cb) {

  getNpmGlobalRootDirectory(() => {

  const npmDir = resolve(source, 'node_modules')

    // Check if node_modules folder exists
    fs.lstat(npmDir, function(er) {
      if (er) {
        return cb({error: 'not a valid npm project'})
      }

      fs.readdir(npmDir, (er, children) => {

        if (er && er.code !== 'ENOTDIR') {
          return cb(er)
        }

        asyncMap(children, (pkg, cb) => {

          const pkgPath = resolve(npmDir, pkg)
          const linkedPath = resolve(globalDir, pkg)

          fs.lstat(pkgPath, function(er, stat) {
            if (er) {
              return cb(er)
            }

            if (stat.isSymbolicLink()) {
              fs.realpath(pkgPath, (er, realPath) => {
                if (er) {
                  return cb(er)
                }
                return cb(null, { name: pkg, src: linkedPath, target: pkgPath, realTargetPath: realPath })
              })
            } else {
              return cb()
            }

          })
        }, (err, pkgs) => {
          if (err) {
            return cb(err)
          }

          const result = pkgs || []

          return cb(null, result)
        })
      })
    })
  })
}
