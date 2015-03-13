'use strict'

const autoLinkBugs = function () {
  const reBugs = /BUG=(\d+)(?:,\s*)?(\d+)?(?:,\s*)?(\d+)?(?:,\s*)?(\d+)?(?:,\s*)?(\d+)?/
  const elemMsg = document.querySelector('.commit-message')
  if (!reBugs.test(elemMsg.textContent)) { return }

  const commitMsg = elemMsg.innerHTML.trim()
  const bugIDs = reBugs.exec(elemMsg.textContent).slice(1).filter(function (v) { return !!v })

  const newMsg = commitMsg.replace(reBugs, function () {
    const crbugPrefix = 'https://code.google.com/p/chromium/issues/detail?id='
    const result = `BUG=${
      bugIDs.map(function (id) {
        return `<a class="crbug" href="${crbugPrefix + id}">${id}</a>`
      }).join(', ')
    }`
    return result
  })
  elemMsg.innerHTML = newMsg
}

const addBugTitle = function () {
  const crbugs = query('.crbug[href]')
  !!crbugs.length && crbugs.forEach(function (a) {
    request(a.href, { type: 'document' }).then(function (response) {
      a.title = response.body.querySelector('span.h3').textContent
    })
  })
}

if (/.+\/\+\/[0-9a-f]{5,40}(?:%5E%21)?\/?$/.test(location.pathname)) {
  autoLinkBugs()
  addBugTitle()
}
