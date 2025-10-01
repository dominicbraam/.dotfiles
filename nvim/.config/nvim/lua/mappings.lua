require("nvchad.mappings")

-- disable mappings
local nomap = vim.keymap.del

nomap("n", "<C-n>")
nomap("n", "<Tab>")
nomap("n", "<S-Tab>")

-- add yours here

local map = vim.keymap.set

map("n", ";", ":", { desc = "CMD enter command mode" })
map("i", "jk", "<ESC>")
map("n", "<leader>lg", ":LazyGit <cr>", { desc = "Open LazyGit" })
map("n", "<leader>fg", ":Telescope live_grep <cr>", { desc = "Live Grep" })
map("n", "<leader>tr", function()
    require("base46").toggle_transparency()
end, { desc = "Toggle transparency" })
map("n", "<leader>gs", ":lua require('neogen').generate() <cr>", { desc = "Generate docstring" })
map({ "n", "v" }, "<leader>om", ":Oatmeal <cr>", { desc = "Start Oatmeal session" })
map("n", "<leader>fn", ":Yazi cwd<cr>", { desc = "Open file manager (yazi) at current working directory" })

-- map({ "n", "i", "v" }, "<C-s>", "<cmd> w <cr>")
