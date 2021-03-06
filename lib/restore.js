'use strict'
module.exports = function restoreContext (data) {
  var target = data.target
  var state = target._s
  if (state) {
    let resolved = state.applyContext(target._sc)
    if (resolved) {
      target._s = state = resolved
      target._sc = state.storeContext()
    } else if (resolved === null) {
      target._s = null
      delete target._sc
      state = null
    }
    data.state = state
  }
}
