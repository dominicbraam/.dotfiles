-- lua/custom/mappings 
local M = {}

M.abc = {

  n = {
     ["<leader>lg"] = {"<cmd> LazyGit <CR>", "Open LazyGit"},
     ["<leader>fg"] = {"<cmd> Telescope live_grep <CR>", "live grep"}
  }
}

return M
