-- custom.plugins.notify
require("notify").setup {
  render = 'compact',
  stages = 'fade_in_slide_out',
  timeout = 3000,
}
vim.notify = require('notify')
