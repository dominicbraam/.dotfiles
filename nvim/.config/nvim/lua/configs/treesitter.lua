pcall(function()
	dofile(vim.g.base46_cache .. "syntax")
	dofile(vim.g.base46_cache .. "treesitter")
end)

local treesitter = require("nvim-treesitter")

treesitter.setup({
	install_dir = vim.fn.stdpath("data") .. "/site",
})

treesitter.install({
	"bash",
	"lua",
	"luadoc",
	"markdown",
	"markdown_inline",
	"python",
	"printf",
	"r",
	"rust",
	"sql",
	"vim",
	"vimdoc",
	"yaml",
})
