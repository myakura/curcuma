'use strict'

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
    '<figure class="curcuma-preview">\n' +
    '<img src="' + dataURL + '">\n' +
    '</figure>'
  document.querySelector('.footer').insertAdjacentHTML('beforebegin', previewFragment)
}

if (!!ext && !!supportedImages.has(ext)) {
  var imagePath = url.origin + url.pathname
  request(imagePath + '?format=TEXT').then(addPreviewImage)
}