return {
  ["neovim/nvim-lspconfig"] = {
    config = function()
      require "plugins.configs.lspconfig"
      require "custom.plugins.lspconfig"
    end,
    },
  ["kdheepak/lazygit.nvim"] = {},
  ["rcarriga/nvim-notify"] = {
    config = function()
      require "custom.plugins.notify"
    end,
  },
}
