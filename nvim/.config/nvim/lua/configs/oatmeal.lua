local handle = io.popen("secret-tool lookup apikey openai-shell-cli")
if not handle then
    error("Error: io.popen returned nil")
end
local token = handle:read("*a")
handle:close()

local opts = {
    hotkey = "<leader>om",
    close_terminal_on_quit = true,
    backend = "openai",
    model = "o3-mini",
    open_ai_token = token,
}

require("oatmeal").setup(opts)
