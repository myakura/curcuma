'use strict'

// todo: handle TypeError thrown by URL()

var getFileExtension = function (urlOrPath) {
  var pathname = /^https?/.test(urlOrPath) ? new URL(urlOrPath).pathname : urlOrPath
  return (/.*\.(.+)$/.exec(pathname) || [])[1]
}

var getImageMIME = function (urlOrPath) {
  var mimeMap = new Map([
    ['png', 'image/png'],
    ['jpg', 'image/jpeg'],
    ['jpeg', 'image/jpeg'],
    ['webp', 'image/webp'],
    ['svg', 'image/svg+xml'],
    ['svgz', 'image/svg+xml'],
  ])
  var extension = getFileExtension(urlOrPath)
  return mimeMap.get(extension)
}

var validateImageURL = function (urlOrPath) {
  return !!getFileExtension(urlOrPath) && !!getImageMIME(urlOrPath)
}

var getPreviewImage = function (url) {
  var url = new URL(url)
  var extension = getFileExtension(url)
  var mime = getImageMIME(url)

  var imageDataURL = url.origin + url.pathname + '?format=TEXT'
  return request(imageDataURL).then(function (base64Body) {
    var dataURL = 'data:' + mime + ';base64,' + base64Body
    return (dataURL)
  })
}

// kick off for file view
if (validateImageURL(location.href)) {
  getPreviewImage(location.href).then(function (dataURL) {
    var previewFragment =
      '<figure class="curcuma-preview">\n' +
      '<img src="' + dataURL + '">\n' +
      '</figure>\n'
    document.querySelector('.footer').insertAdjacentHTML('beforebegin', previewFragment)
  })
}

// kick off for diff view
var imageDiffHeaders = [].slice.call(document.querySelectorAll('.diff-header')).filter(function (diffHeader) {
  var a = diffHeader.querySelector('a[href]')
  return validateImageURL(a.href)
})
imageDiffHeaders.forEach(function (imageDiffHeader) {
  // todo: add .image-old or .image-new to the <img>
  var imageURLs = [].slice.call(imageDiffHeader.querySelectorAll('a[href]')).map(function (a) {
    return a.href
  })
  Promise.all(imageURLs.map(getPreviewImage)).then(function (dataURLs) {
    var previewFragment = '<figure class="curcuma-preview">\n'
    dataURLs.forEach(function (dataURL) {
      previewFragment += '<img src="' + dataURL + '">\n'
    })
    previewFragment += '</figure>\n'
    imageDiffHeader.insertAdjacentHTML('afterend', previewFragment)
  })
})