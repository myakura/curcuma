'use strict'

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

var supportedImages = new Map([
  ['png', 'image/png'],
  ['jpg', 'image/jpeg'],
  ['jpeg', 'image/jpeg'],
  ['webp', 'image/webp'],
  ['svg', 'image/svg+xml'],
  ['svgz', 'image/svg+xml'],
])

var url = new URL(location.href)

var getExtension = function (path) {
  var pathname = /^https?/.test(path) ? new URL(path).pathname : path
  return (/.*\.(.+)$/.exec(path) || [])[1]
}

var diffHeaders = [].slice.call(document.querySelectorAll('.diff-header'))

var imageDiffHeaders = diffHeaders.filter(function (elem) {
  var a = elem.querySelector('a[href]')
  var ext = getExtension(a.href)
  return supportedImages.has(ext)
})

var getFilePaths = function (diffHeader) {
  var result = new Map()
  var links = [].slice.call(diffHeader.querySelectorAll('a[href]'))
  var urls = new Map()
  links.forEach(function (link) {
    var href = link.href
    var ext = getExtension(href)
    result.set('ext', ext)
    var content = link.textContent.trim()
    var key = /^a\/.+/.test(content) ? 'old' : 'new'
    urls.set(key, href)
  })
  result.set('urls', urls)
  return result
}

imageDiffHeaders.forEach(function (imageDiffHeader) {
  var filePaths = getFilePaths(imageDiffHeader)
  var ext = filePaths.get('ext')
  var files = filePaths.get('urls')

  var figureFragment = '<figure class="curcuma-preview">'

  var requestImagePromise = function (key, ext) {
    return new Promise(function (resolve, reject) {
      request(files.get(key) + '?format=TEXT')
      .then(function (base64Body) {
        var dataURL = 'data:' + supportedImages.get(ext) + ';base64,' + base64Body
        resolve('<img class="image-' + key + '" src="' + dataURL + '">')
      })
      .catch(reject)
    })
  }

  if (files.size === 2) {
    var requestOld = requestImagePromise('old', ext)
    var requestNew = requestImagePromise('new', ext)
    Promise.all([requestOld, requestNew])
    .then(function (imageFragments) {
      figureFragment += imageFragments.join('') + '</figure>'
      imageDiffHeader.insertAdjacentHTML('afterend', figureFragment)
    })
    .catch(console.error)
  }
  else {
    requestImagePromise(files.keys().next().value, ext)
    .then(function (imageFragment) {
      figureFragment += imageFragment + '</figure>'
      imageDiffHeader.insertAdjacentHTML('afterend', figureFragment)
    })
  }
})