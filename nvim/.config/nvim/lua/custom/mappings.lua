-- lua/custom/mappings 
local M = {}

M.abc = {

  n = {
     ["<leader>lg"] = {"<cmd> LazyGit <CR>", "Open LazyGit"}
  }
}

return M
