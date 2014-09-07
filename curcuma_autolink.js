'use strict'

var autoLinkBugs = function () {
  var reBugs = /BUG=(\d+)(?:,\s*)?(\d+)?(?:,\s*)?(\d+)?(?:,\s*)?(\d+)?(?:,\s*)?(\d+)?/
  var elemMsg = document.querySelector('.commit-message')
  var commitMsg = elemMsg.innerHTML.trim()
  var bugIDs = reBugs.exec(elemMsg.textContent).slice(1).filter(function (v) { return !!v })

  var newMsg = commitMsg.replace(reBugs, function () {
    var result = 'BUG='
    bugIDs.forEach(function (id) {
      result += '<a href="http://crbug.com/' + id + '">' + id + '</a>, '
    })
    return result.slice(0, -2)
  })
  elemMsg.innerHTML = newMsg
}

autoLinkBugs()

// ideas:
// - show bug title in the tooltip
// - link to test files