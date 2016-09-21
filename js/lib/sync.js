import { symlinkPossibilities, symlinkSelections } from './linkable'

export default function sync(context, cb) {
  const p1 = new Promise((resolve, reject) => {
    symlinkPossibilities((err, pkgs) => {
      if (err) {
        reject(err)
      } else {
        resolve(pkgs)
      }
    })
  })

  const p2 = new Promise((resolve, reject) => {
    symlinkSelections(context, (err, pkgs) => {
      if (err) {
        reject(err)
      } else {
        resolve(pkgs)
      }
    })
  })

  Promise.all([p1, p2]).then(values => {
    cb(null, { symlinkPossibilities: values[0], symlinkSelections: values[1] })
  }, reason => {
    console.warn('could not complete sync:', reason)
  })
}
