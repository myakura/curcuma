'use strict'

// modifying changeset title to include revision and summary
// original structure: [hash] - [repo/dir] - Git at Google
// (e.g. 4b7159b920caefd3bc8d48a35daddd9bbac862dc - chromium/blink - Git at Google)
// modified title: [shorthash] (@[revision]) - [repo/dir] -- [summary]
if (/.+\/\+\/[0-9a-f]{5,40}/.test(location.pathname)) {
  var message = document.querySelector('.commit-message').textContent
  var revision = /git-svn-id: svn:\/\/.*@(\d+)/.test(message) ? message.match(/git-svn-id: svn:\/\/.*@(\d+)/)[1] : null
  var summary = message.match(/(.*)\n/)[1]
  var title = document.title
  var reTitle = /([0-9a-f]+) - (.+?) / // extracting hash and reponame
  document.title = reTitle.exec(title)[1].slice(0,10) + (!!revision ? ' (@' + revision + ') ' : '') + ' - ' + reTitle.exec(title)[2] + ' \u2014 ' + summary
}