-- EXAMPLE
local on_attach = require("nvchad.configs.lspconfig").on_attach
local on_init = require("nvchad.configs.lspconfig").on_init
local capabilities = require("nvchad.configs.lspconfig").capabilities

local lspconfig = require("lspconfig")
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
    "yamlls",
}

-- lsps with default config
for _, lsp in ipairs(servers) do
    lspconfig[lsp].setup({
        on_attach = on_attach,
        on_init = on_init,
        capabilities = capabilities,
    })
end

-- typescript
lspconfig.ts_ls.setup({
    on_attach = on_attach,
    on_init = on_init,
    capabilities = capabilities,
})
