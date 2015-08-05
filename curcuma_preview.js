'use strict'

const getFileExtension = url => {
  const pathname = new URL(url).pathname
  return (/.*\.(.+)$/.exec(pathname) || [])[1]
}

const getImageMIME = url => {
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
  const extension = (`${getFileExtension(url)}`).toLowerCase()
  return mimeMap.get(extension)
}

const validateImageURL = url => {
  return !!getFileExtension(url) && !!getImageMIME(url)
}

const getPreviewImage = imagePageURL => {
  const url = new URL(imagePageURL)
  const mime = getImageMIME(url)

  // adding '?format=TEXT' to the end returns a Base64-encoded body
  const imageDataURL = url.origin + url.pathname + '?format=TEXT'

  return fetch(imageDataURL)
  .then(response => response.text())
  .then(data => `data:${mime};base64,${data}`)
}

// kick off for file view
if (validateImageURL(location.href)) {
  getPreviewImage(location.href)
  .then(dataURL => {
    const previewFragment = `
<figure class="curcuma-preview">
<img src="${dataURL}">
</figure>
`
    document.querySelector('.footer').insertAdjacentHTML('beforebegin', previewFragment)
  })
  .catch(console.log.bind(console))
}

// kick off for diff view
const imageDiffHeaders = query('.diff-header').filter(diffHeader => {
  return validateImageURL(diffHeader.querySelector('a[href]').href)
})
imageDiffHeaders.forEach(imageDiffHeader => {
  let className = /new file mode/.test(imageDiffHeader.textContent) ? 'image-new' : '' // newly added files
  const imageURLs = query('a[href]', imageDiffHeader).map(a => a.href)
  Promise.all(imageURLs.map(getPreviewImage))
  .then(dataURLs => {
    const previewFragment = `
<figure class="curcuma-preview">${
  dataURLs.map((dataURL, index) => {
    className = !!className || !!index ? 'image-new' : 'image-old'
    return `<img class="${className}" src="${dataURL}">`
  }).join('')
}</figure>
`
    imageDiffHeader.insertAdjacentHTML('afterend', previewFragment)
  })
  .catch(console.log.bind(console))
})
