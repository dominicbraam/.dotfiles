-- This file  needs to have same structure as nvconfig.lua
-- https://github.com/NvChad/NvChad/blob/v2.5/lua/nvconfig.lua

---@type ChadrcConfig
local M = {}

M.base46 = {
    theme = "tokyodark",
    transparency = true,
    theme_toggle = { "tokyodark", "gruvbox_light" },
}

M.ui = {

    statusline = {
        theme = "minimal",
        separator_style = "round",
    },

    telescope = { style = "bordered" }, -- borderless / bordered

    -- lazyload it when there are 1+ buffers
    tabufline = {
        enabled = false,
        lazyload = false,
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
    sizes = { sp = 0.5, vsp = 0.5 },
    float = {
        relative = "editor",
        width = 1.0,
        height = 0.9,
        border = "single",
    },
}

-- return M
local status, chadrc = pcall(require, "chadrc")
return vim.tbl_deep_extend("force", M, status and chadrc or {})
