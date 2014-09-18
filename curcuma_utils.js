'use strict'

var request = function request (url, options) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.responseType = !!options && options.type || ''
    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve(xhr.response)
      }
      else {
        reject(new Error(xhr.statusText))
      }
    }
    xhr.onerror = function () {
      reject(new Error(xhr.statusText))
    }
    xhr.send()
  })
}

var query = function query (selectors, scope) {
  var scopeNode = scope === undefined ? document : scope
  var nodelist = scopeNode.querySelectorAll(selectors)
  return [].slice.call(nodelist)
}