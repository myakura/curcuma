'use strict'

// modifying changeset title to include summary
// original: [hash] - [repo/dir] - Git at Google
// modified: [repo/dir] - [shorthash] -- [summary]
var updateTitle = function () {
  var message = document.querySelector('.commit-message').textContent
  // var revision = /git-svn-id: svn:\/\/.*@(\d+)/.test(message) ? message.match(/git-svn-id: svn:\/\/.*@(\d+)/)[1] : null
  var summary = message.match(/(.*)\n/)[1]
  var title = document.title
  var reTitle = /([0-9a-f]+) - (.+?) /
  var repo = reTitle.exec(title)[2]
  var hash = reTitle.exec(title)[1].slice(0, 10)
  document.title = repo + ' - ' + hash + ' \u2014 ' + summary
}

if (/.+\/\+\/[0-9a-f]{5,40}$/.test(location.pathname)) {
  updateTitle()
}