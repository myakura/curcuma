'use strict'

// modifying changeset title to include summary
// original: [hash] - [repo/dir] - Git at Google
// modified: [repo/dir] - [shorthash] -- [summary]
const updateTitle = () => {
  const message = document.querySelector('.commit-message').textContent
  const summary = message.match(/(.*)\n/)[1]
  const title = document.title
  const reTitle = /([0-9a-f]+) - (.+?) /
  const repo = reTitle.exec(title)[2]
  const hash = reTitle.exec(title)[1].slice(0, 10)
  document.title = repo + ' - ' + hash + ' \u2014 ' + summary
}

if (/.+\/\+\/[0-9a-f]{5,40}$/.test(location.pathname)) {
  updateTitle()
}
