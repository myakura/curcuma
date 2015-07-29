'use strict'

var query = (selectors, scope) => {
  var scopeNode = scope === undefined ? document : scope
  return Array.from(scopeNode.querySelectorAll(selectors))
}
