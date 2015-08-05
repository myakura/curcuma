'use strict'

const autoLinkBugs = () => {
  const reBugs = /BUG=(\d+)(?:,\s*)?(\d+)?(?:,\s*)?(\d+)?(?:,\s*)?(\d+)?(?:,\s*)?(\d+)?/
  const elemMessage = document.querySelector('.commit-message')
  if (!reBugs.test(elemMessage.textContent)) { return }

  const commitMessage = elemMessage.innerHTML.trim()
  const bugIDs = reBugs.exec(elemMessage.textContent).slice(1).filter(v => !!v)

  const crbugPrefix = 'https://code.google.com/p/chromium/issues/detail?id='
  const newBugLine = `BUG=${bugIDs.map(id => `<a class="crbug" href="${crbugPrefix + id}">${id}</a>`).join(', ')}`
  elemMessage.innerHTML = commitMessage.replace(reBugs, newBugLine)
}

if (/.+\/\+\/[0-9a-f]{5,40}(?:%5E%21)?\/?$/.test(location.pathname)) {
  autoLinkBugs()
}
