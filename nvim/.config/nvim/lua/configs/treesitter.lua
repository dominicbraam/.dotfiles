pcall(function()
    dofile(vim.g.base46_cache .. "syntax")
    dofile(vim.g.base46_cache .. "treesitter")
end)

return {
    ensure_installed = {
        "bash",
        "lua",
        "luadoc",
        "markdown",
        "python",
        "printf",
        "r",
        "rust",
        "onoweb",
        "sql",
        "vim",
        "vimdoc",
        "yaml",
    },

    highlight = {
        enable = true,
        use_languagetree = true,
    },

    indent = { enable = true },
}
