local options = {
	formatters_by_ft = {
		bash = { "shfmt" },
		c = { "clang-format" },
		css = { "prettier" },
		html = { "prettier" },
		javascript = { "prettier" },
		javascriptreact = { "prettier" },
		json = { "prettier" },
		lua = { "stylua" },
		markdown = { "prettier" },
		php = { "pretty-php" },
		python = { "black" },
		r = { "prettier" },
		rust = { "rustfmt" },
		sh = { "shfmt" },
		sql = { "sql-formatter" },
		toml = { "pyproject-fmt" },
		typescript = { "prettier" },
		typescriptreact = { "prettier" },
		yaml = { "prettier" },
		zsh = { "shfmt" },
	},
	formatters = {
		black = {
			prepend_args = { "--line-length", "79" },
		},
		prettier = {
			prepend_args = { "--tab-width", "4", "--print-width", "79" },
		},
		stylua = {
			prepend_args = {
				"--indent-type",
				"Tabs",
				"--indent-width",
				"4",
				"--column-width",
				"79",
			},
		},
		clang_format = {
			prepend_args = {
				"--style={BasedOnStyle: LLVM, IndentWidth: 4, TabWidth: 4, UseTab: Never, ColumnLimit: 79}",
			},
		},
	},

	format_on_save = {
		-- These options will be passed to conform.format()
		timeout_ms = 500,
		lsp_fallback = false,
	},
}

require("conform").setup(options)
