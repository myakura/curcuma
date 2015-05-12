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
  // a regex to extract issue title from crbug.com
  // the <title> is formatted as follows. note the leading space:
  // ```
  //  <title>Issue 17217 - 
  //  chromium -
  //  
  //  margin 0 css is causing horizontal scrollbar to show up 100% width - 
  //  An open-source project to help move the web forward. - Google Project Hosting
  //  </title>
  // ```
  const reTitle = /<title>.+\n .+\n .+\n (.+) - \n/

  const crbugs = query('.crbug[href]')
  !!crbugs.length && crbugs.forEach(function (a) {
    request(a.href).then(function (response) {
      if (reTitle.test(response.body)) {
        a.title = reTitle.exec(response.body)[1].trim()
      }
    })
  })
}

if (/.+\/\+\/[0-9a-f]{5,40}(?:%5E%21)?\/?$/.test(location.pathname)) {
  autoLinkBugs()
  addBugTitle()
}
