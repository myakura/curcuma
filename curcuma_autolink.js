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

var autoLinkBugs = function () {
  var reBugs = /BUG=(\d+)(?:,\s*)?(\d+)?(?:,\s*)?(\d+)?(?:,\s*)?(\d+)?(?:,\s*)?(\d+)?/
  var elemMsg = document.querySelector('.commit-message')
  var commitMsg = elemMsg.innerHTML.trim()
  var bugIDs = reBugs.exec(elemMsg.textContent).slice(1).filter(function (v) { return !!v })

  var newMsg = commitMsg.replace(reBugs, function () {
    var result = 'BUG='
    bugIDs.forEach(function (id) {
      result += '<a class="crbug" href="https://code.google.com/p/chromium/issues/detail?id=' + id + '">' + id + '</a>, '
    })
    return result.slice(0, -2)
  })
  elemMsg.innerHTML = newMsg
}

var addBugTitle = function () {
  var crbugs = [].slice.call(document.querySelectorAll('.crbug[href]'))
  crbugs.forEach(function (a) {
    request(a.href, { type: 'document' }).then(function (response) {
      a.title = response.querySelector('span.h3').textContent
    })
  })
}

if (/.+\/\+\/[0-9a-f]{5,40}/.test(location.pathname)) {
  autoLinkBugs()
  addBugTitle()
}

// ideas:
// - link to test files