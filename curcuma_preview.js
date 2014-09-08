'use strict'

var request = function (url, options) {
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

var supportedImages = new Map([
  ['png', 'image/png'],
  ['jpg', 'image/jpeg'],
  ['jpeg', 'image/jpeg'],
  ['webp', 'image/webp'],
  ['svg', 'image/svg+xml'],
  ['svgz', 'image/svg+xml'],
])

var url = new URL(location.href)
var checkPath = function () {
  return /https:\/\/chromium\.googlesource\.com\/.*\/\+\/.*\.(.+)$/.test(url.href)
}
var ext = checkPath() ? /.*\.(.+)$/.exec(url.pathname)[1] : ''

var addPreviewImage = function (base64Body) {
  var dataURL = 'data:' + supportedImages.get(ext) + ';base64,' + base64Body
  var previewFragment = 
  '<figure class="preview">\n' +
  '<style>.preview { margin: 1em 0; padding: 1em 2em; border: #ddd solid; border-width: 1px 0; }</style>\n' +
  '<img src="' + dataURL + '">\n' +
  '</figure>'
  document.querySelector('.footer').insertAdjacentHTML('beforebegin', previewFragment)
}

if (!!ext && !!supportedImages.has(ext)) {
  var imagePath = url.origin + url.pathname
  request(imagePath + '?format=TEXT').then(addPreviewImage)
}
