require("nvchad.mappings")

-- add yours here

local map = vim.keymap.set

map("n", ";", ":", { desc = "CMD enter command mode" })
map("i", "jk", "<ESC>")
map("n", "<leader>lg", ":LazyGit <cr>", { desc = "Open LazyGit" })
map("n", "<leader>fg", ":Telescope live_grep <cr>", { desc = "Live Grep" })
map("n", "<leader>tr", function()
    require("base46").toggle_transparency()
end, { desc = "Toggle transparency" })
map("n", "<Leader>gs", ":lua require('neogen').generate() <cr>", { desc = "Generate docstring" })

-- map({ "n", "i", "v" }, "<C-s>", "<cmd> w <cr>")
