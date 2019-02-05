'use strict';

const autoLinkBugs = () => {
  const reBugs = /BUG[:=]\s*(\d+)(?:,\s*)?(\d+)?(?:,\s*)?(\d+)?(?:,\s*)?(\d+)?(?:,\s*)?(\d+)?/i;
  const elemMessage = document.querySelector('.MetadataMessage');
  if (!reBugs.test(elemMessage.textContent)) {
    return;
  }

  const commitMessage = elemMessage.innerHTML.trim();
  const bugIDs = reBugs
    .exec(elemMessage.textContent)
    .slice(1)
    .filter(v => !!v);

  const crbugPrefix = 'https://bugs.chromium.org/p/chromium/issues/detail?id=';
  const newBugLine = `Bug: ${bugIDs
    .map(id => `<a class="crbug" href="${crbugPrefix + id}">${id}</a>`)
    .join(', ')}`;
  elemMessage.innerHTML = commitMessage.replace(reBugs, newBugLine);
};

if (/.+\/\+\/[0-9a-f]{5,40}(?:%5E%21)?\/?$/.test(location.pathname)) {
  autoLinkBugs();
}
