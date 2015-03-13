'use strict'

// todo: handle TypeError thrown by URL()

const getFileExtension = function (urlOrPath) {
  const pathname = /^https?/.test(urlOrPath) ? new URL(urlOrPath).pathname : urlOrPath
  return (/.*\.(.+)$/.exec(pathname) || [])[1]
}

const getImageMIME = function (urlOrPath) {
  const mimeMap = new Map([
    ['gif', 'image/gif'],
    ['png', 'image/png'],
    ['jpg', 'image/jpeg'],
    ['jpeg', 'image/jpeg'],
    ['webp', 'image/webp'],
    ['bmp', 'image/bmp'],
    ['svg', 'image/svg+xml'],
    ['svgz', 'image/svg+xml'],
  ])
  const extension = (`${getFileExtension(urlOrPath)}`).toLowerCase()
  return mimeMap.get(extension)
}

const validateImageURL = function (urlOrPath) {
  return !!getFileExtension(urlOrPath) && !!getImageMIME(urlOrPath)
}

const getPreviewImage = function (imagePageURL) {
  let url = new URL(imagePageURL)
  const mime = getImageMIME(url)

  // '?format=TEXT' returns a Base64-encoded body
  const imageDataURL = url.origin + url.pathname + '?format=TEXT'

  return fetch(imageDataURL).then(function (response) {
    return response.text().then(function (data) {
      return `data:${mime};base64,${data}`
    })
  })
}

// kick off for file view
if (validateImageURL(location.href)) {
  getPreviewImage(location.href).then(function (dataURL) {
    const previewFragment = `
<figure class="curcuma-preview">
<img src="${dataURL}">
</figure>
`
    document.querySelector('.footer').insertAdjacentHTML('beforebegin', previewFragment)
  })
}

// kick off for diff view
const imageDiffHeaders = query('.diff-header').filter(function (diffHeader) {
  const a = diffHeader.querySelector('a[href]')
  return validateImageURL(a.href)
})
imageDiffHeaders.forEach(function (imageDiffHeader) {
  let className = ''
  if (/new file mode/.test(imageDiffHeader.textContent)) {
    className = 'image-new'
  }
  const imageURLs = query('a[href]', imageDiffHeader).map(function (a) { return a.href })
  Promise.all(imageURLs.map(getPreviewImage)).then(function (dataURLs) {
    var previewFragment = `
<figure class="curcuma-preview">${
  dataURLs.map(function (dataURL, index) {
    className = !!className || !!index ? 'image-new' : 'image-old'
    return `<img class="${className}" src="${dataURL}">`
  }).join('')
}</figure>
`
    imageDiffHeader.insertAdjacentHTML('afterend', previewFragment)
  })
})
