-- EXAMPLE
local on_attach = require("nvchad.configs.lspconfig").on_attach
local on_init = require("nvchad.configs.lspconfig").on_init
local capabilities = require("nvchad.configs.lspconfig").capabilities

local servers = {
	"bashls",
	"clangd",
	"cssls",
	"dockerls",
	"gopls",
	"html",
	"jsonls",
	"marksman",
	"rust_analyzer",
	"sqlls",
	"powershell_es",
	"phpactor",
	"pylsp",
	"r_language_server",
	"ts_ls",
	"turtle_ls",
	"yamlls",
}

-- lsps with default config
for _, server in ipairs(servers) do
	vim.lsp.config(server, {
		on_attach = on_attach,
		on_init = on_init,
		capabilities = capabilities,
	})

	vim.lsp.enable(server)
end

-- typescript
vim.lsp.config("ts_ls", {
	on_attach = on_attach,
	on_init = on_init,
	capabilities = capabilities,
})
vim.lsp.enable("ts_ls")
