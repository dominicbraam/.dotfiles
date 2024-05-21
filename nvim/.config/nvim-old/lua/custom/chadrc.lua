-- First read our docs (completely) then check the example_config repo

local M = {}

M.ui = {
  theme = "tokyodark",
  -- theme_toggle = { "gruvbox_material", "gruvbox_light" },
}

M.plugins = {
  user = require("custom.plugins"),
}

M.mappings = require "custom.mappings"

return M
