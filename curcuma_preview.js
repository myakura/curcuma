    ['gif', 'image/gif'],
    ['bmp', 'image/bmp'],
  // '?format=TEXT' returns a Base64-encoded body
  return request(imageDataURL).then(function (response) {
    var dataURL = 'data:' + mime + ';base64,' + response.body
  var className = ''
  if (/new file mode/.test(imageDiffHeader.textContent)) {
    className = 'image-new'
  }
  var imageURLs = query('a[href]', imageDiffHeader).map(function (a) { return a.href })
      dataURLs.map(function (dataURL, index) {
        className = !!className || !!index ? 'image-new' : 'image-old'
        return '<img class="' + className + '" src="' + dataURL + '">\n'