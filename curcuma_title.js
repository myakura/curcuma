'use strict'

// modifying changeset title to include summary
// original: [hash] - [repo/dir] - Git at Google
// modified: [repo/dir] - [shorthash] -- [summary]
const updateTitle = () => {
  const message = document.querySelector('.MetadataMessage').textContent
  const summary = message.match(/(.*)\n/)[1]
  const title = document.title
  const reTitle = /([0-9a-f]+) - (.+?) /
  const [_, hash, repo] = reTitle.exec(title)
  document.title = `${repo} - ${hash.slice(0, 10)} \u2014 ${summary}`
}

if (/.+\/\+\/[0-9a-f]{5,40}$/.test(location.pathname)) {
  updateTitle()
}
