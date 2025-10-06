local config = require("nvchad.configs.telescope") -- NvChad’s defaults
config.pickers = {
    grep_string = {
        additional_args = { "--hidden" },
    },
    live_grep = {
        additional_args = { "--hidden" },
    },
}

require("telescope").setup(config)
