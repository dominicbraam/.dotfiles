local options = {
    formatters_by_ft = {
        bash = { "shfmt" },
        c = { "clang-format" },
        css = { "prettier" },
        html = { "prettier" },
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
        yaml = { "prettier" },
        zsh = { "shfmt" },
    },
    formatters = {
        black = {
            prepend_args = { "--line-length", "79" },
        },
    },

    format_on_save = {
        -- These options will be passed to conform.format()
        timeout_ms = 500,
        lsp_fallback = true,
    },
}

require("conform").setup(options)
