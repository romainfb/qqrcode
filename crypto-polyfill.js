/**
 * Polyfill pour crypto.hash() pour Node.js < 22
 * Vite 7.2+ utilise crypto.hash() qui n'existe pas avant Node.js 22
 */

const Module = require('module')
const originalRequire = Module.prototype.require

Module.prototype.require = function (id) {
  const module = originalRequire.apply(this, arguments)

  if (id === 'crypto' || id === 'node:crypto') {
    if (!module.hash) {
      module.hash = function (algorithm, data, outputEncoding) {
        return module.createHash(algorithm).update(data).digest(outputEncoding)
      }
    }
  }

  return module
}



