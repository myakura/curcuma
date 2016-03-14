'use strict'

const data = require('sdk/self').data
const pageMod = require('sdk/page-mod')

pageMod.PageMod({
  include: 'https://*.googlesource.com/*',
  contentScriptFile: [
    data.url('../curcuma_title.js'),
    data.url('../curcuma_preview.js'),
  ],
  contentStyleFile: [
    data.url('../curcuma_preview.css'),
  ],
})

pageMod.PageMod({
  include: 'https://chromium.googlesource.com/*',
  contentScriptFile: [
    data.url('../curcuma_autolink.js'),
  ],
})