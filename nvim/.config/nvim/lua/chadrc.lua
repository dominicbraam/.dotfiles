-- This file  needs to have same structure as nvconfig.lua
-- https://github.com/NvChad/NvChad/blob/v2.5/lua/nvconfig.lua

---@type ChadrcConfig
local M = {}

M.base46 = {
    theme = "tokyonight",
    transparency = true,
}

M.ui = {

    statusline = {
        theme = "vscode_colored",
    },

    telescope = { style = "bordered" }, -- borderless / bordered

    -- lazyload it when there are 1+ buffers
    tabufline = {
        enabled = true,
        lazyload = true,
        order = { "treeOffset", "buffers", "tabs", "btns" },
        modules = nil,
    },
}

M.colorify = {
    enabled = true,
    mode = "virtual", -- fg, bg, virtual
    virt_text = "󱓻 ",
    highlight = { hex = true, lspvars = true },
}

M.nvdash = {
    load_on_startup = true,
}

M.term = {
    hl = "Normal:term,WinSeparator:WinSeparator",
    sizes = { sp = 0.4, vsp = 0.4 },
    float = {
        relative = "editor",
        row = 0.15,
        col = 0.2,
        width = 0.6,
        height = 0.65,
        border = "single",
    },
}

-- return M
local status, chadrc = pcall(require, "chadrc")
return vim.tbl_deep_extend("force", M, status and chadrc or {})
